let path = require('path')

module.exports = function(source, map) {
  if (source.indexOf('tinker.macro') !== -1) {
    let rootContext = this.options ? this.options.context : this.rootContext
    this.addContextDependency(path.resolve(rootContext, 'app'))
    this.addContextDependency(path.resolve(rootContext, 'config'))
    this.addContextDependency(path.resolve(rootContext, 'routes'))
  }
  this.callback(null, source, map)
}
