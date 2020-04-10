const _mapValues = require( 'lodash/mapValues' )
const fs = require( 'fs' )

function readSecretVariable(name){
  return fs.readFileSync('/run/secrets/' + name, 'utf8').trim()
}

function injectSecrets(config){
  return _mapValues(config, (name, key) => {
    return readSecretVariable(name)
  })
}

const config = injectSecrets({
  // 'secret': 'docker-secret'
})

module.exports = Object.freeze(config)
