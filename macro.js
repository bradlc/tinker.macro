let { spawn } = require('child_process')
let path = require('path')
let deasync = require('deasync')
let { createMacro } = require('babel-plugin-macros')
let { parseExpression } = require('babylon')
let generate = require('babel-generator').default

module.exports = createMacro(tinkerMacro)

function tinkerMacro({ references, state, babel }) {
  let { types: t } = babel

  references.default &&
    references.default.forEach(ref => {
      if (ref.parentPath.type !== 'TaggedTemplateExpression') return
      let php = ref.parentPath.node.quasi.quasis[0].value.cooked
      let result = evaluate(php, state)
      ref.parentPath.addComment('trailing', 'tinker.macro')
      ref.parentPath.replaceWith(parseExpression(result))
    })

  Object.keys(references)
    .filter(x => x !== 'default')
    .forEach(x => {
      references[x].forEach(ref => {
        let expr = findExpressionParent(ref)

        expr.traverse({
          ObjectExpression(path) {
            let obj = generate(path.node).code
            eval(`obj = ${obj}`)
            path.replaceWith(
              t.callExpression(t.identifier('json_decode'), [
                t.stringLiteral(JSON.stringify(obj)),
                t.booleanLiteral(true)
              ])
            )
          }
        })

        let i = 0
        let code = generate(expr.node).code.replace(
          /\.(?![^(]*\))/g,
          _ => (i++ === 0 ? '::' : '->')
        )

        if (i > 0) {
          code = `App\\${code}`
        }

        let result = evaluate(code, state)
        ref.parentPath.addComment('trailing', 'tinker.macro')
        ref.parentPath.replaceWith(parseExpression(result))
      })
    })
}

function evaluate(php, state) {
  let tinker = spawn('php', [path.resolve(state.cwd, 'artisan'), 'tinker'])
  tinker.stdin.setEncoding('utf-8')

  let done = false
  let reallyDone = false
  let result

  tinker.stdout.on('data', data => {
    if (data.toString().startsWith('=>')) {
      if (done) {
        result = data.toString().match(/=> (.*?)\n/)[1]
        result = result.substr(1, result.length - 2)
        reallyDone = true
      }
      done = true
    }
    if (reallyDone) {
      return
    }
    if (data.toString().startsWith('>>>')) {
      if (done) {
        tinker.stdin.write(`json_encode($_)\n`)
      } else {
        tinker.stdin.write(`${php.replace(/[\n\r]/g, ' ').trim()}\n`)
      }
    }
  })

  deasync.loopWhile(() => !reallyDone)

  tinker.stdin.end()

  return result
}

function findExpressionParent(ref, pos) {
  if (!pos) pos = ref.node.start
  let nextRef = ref.findParent(
    p => p.isCallExpression() || p.isMemberExpression()
  )
  if (nextRef && nextRef.node.start === pos) {
    return findExpressionParent(nextRef, nextRef.node.start)
  }
  return ref
}
