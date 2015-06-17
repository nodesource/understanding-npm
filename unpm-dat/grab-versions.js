module.exports = grabVersions

function grabVersions(name, pkg, out) {
  out.versions = Object.keys(pkg.versions || {}).length
}
