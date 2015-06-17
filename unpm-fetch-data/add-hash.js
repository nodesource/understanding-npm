const quote = require('quotemeta')
const path  = require('path')

module.exports = addHash

function addHash(uri, hash) {
  if (typeof hash !== 'string') return uri
  if (!hash) return uri

  var ext = path.extname(uri)
  var pat = new RegExp('(' + quote(ext) + ')$')

  return uri.replace(pat, '.' + hash.slice(0, 10) + '$1')
}
