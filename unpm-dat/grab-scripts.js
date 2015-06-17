module.exports = grabScripts

function grabScripts(name, pkg, out) {
  var latest = pkg.versions[pkg['dist-tags'].latest]
  out.scripts = Object.keys(latest.scripts || {}).length
}
