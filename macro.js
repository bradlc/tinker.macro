let { spawn } = require('child_process')
let path = require('path')
let deasync = require('deasync')
let { createMacro } = require('babel-plugin-macros')
let { parseExpression } = require('babylon')

module.exports = createMacro(tinkerMacro)

function tinkerMacro({ references, state, babel }) {
  let { types: t } = babel

  if (typeof references.default === 'undefined') return

  references.default.forEach(ref => {
    if (ref.parentPath.type !== 'TaggedTemplateExpression') return

    let php = ref.parentPath.node.quasi.quasis[0].value.cooked

    let tinker = spawn('php', [path.resolve(state.cwd, 'artisan'), 'tinker'])
    tinker.stdin.setEncoding('utf-8')

    let done = false
    let result

    tinker.stdout.on('data', data => {
      if (data.toString().startsWith('=>')) {
        result = data.toString().match(/=> (.*?)\n/)[1]
        result = result.substr(1, result.length - 2)
        done = true
      }
      if (done) {
        tinker.stdin.end()
        return
      }
      if (data.toString().startsWith('>>>')) {
        tinker.stdin.write(`json_encode(${php})\n`)
      }
    })

    deasync.loopWhile(() => !done)

    ref.parentPath.replaceWith(parseExpression(result))
  })
}
