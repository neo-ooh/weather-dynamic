const { whenDev } = require('@craco/craco')

module.exports = {
  webpack: {
    plugins: {
      remove: ['ModuleScopePlugin']
    }
  }
}
