const Promise = require('es6-promise').Promise
const addHash = require('./add-hash')
const xhr     = require('xhr')

module.exports = getQuantity

function getQuantity(uri, TypedArray, hash) {
  uri = addHash(uri, hash)

  return new Promise(function(resolve, reject) {
    var req = xhr({
      uri: uri,
      responseType: 'arraybuffer'
    }, loaded)

    function loaded(err, res, body) {
      if (err) return reject(err)
      resolve(new TypedArray(body))
    }
  })
}
