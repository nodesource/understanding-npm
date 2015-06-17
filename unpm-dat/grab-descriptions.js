module.exports = grabDescriptions

function grabDescriptions(name, pkg, out) {
  out.description = (pkg.description || '').length
}
