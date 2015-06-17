module.exports = grabSizes

function grabSizes(name, pkg, out) {
  var latest = pkg['dist-tags'].latest
  var key    = name + '-' + latest + '.tgz'
  if (!pkg.blobs) return out.size = 0

  var versions = Object.keys(pkg.blobs)
  var blob     = pkg.blobs[key]
    ? pkg.blobs[key]
    : pkg.blobs[versions[0]]

  out.size = blob && blob.size || 0
}
