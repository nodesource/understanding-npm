const Promise   = require('es6-promise').Promise
const IndexList = require('index-list')
const addHash   = require('./add-hash')
const xhr       = require('xhr')

module.exports = getCategory

function getCategory(binUri, jsonUri, hash) {
  binUri  = addHash(binUri, hash)
  jsonUri = addHash(jsonUri, hash)

  return new Promise(getCategoryData)

  function getCategoryData(resolve, reject) {
    var binData
    var req = xhr({
      uri: binUri,
      responseType: 'arraybuffer'
    }, loadedBin)

    function loadedBin(err, res, body) {
      if (err) return reject(err)

      binData = new Uint8Array(body)

      var req = xhr({
        uri: jsonUri
      }, loadedJson)
    }

    function loadedJson(err, res, body) {
      if (err) return reject(err)

      try {
        var json = JSON.parse(body)

        resolve(IndexList.load({
          index: json,
          items: binData
        }))
      } catch(e) {
        reject(e)
      }
    }
  }
}
