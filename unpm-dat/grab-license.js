var spdx = require('spdx-correct')

module.exports = grabLicense

function grabLicense(name, pkg, out) {
  var latest = pkg.versions[pkg['dist-tags'].latest]
  if (latest) latest = latest.license; else return
  if (Array.isArray(latest)) latest = latest[0]
  if (latest && latest.type) latest = latest.type
  if (latest && latest.name) latest = latest.name

  out.license = spdx(String(latest) || ' ') || latest || null
}
