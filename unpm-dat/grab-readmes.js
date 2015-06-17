module.exports = grabReadmes

function grabReadmes(name, pkg, out) {
  out.readme = (pkg.readme || '').length
}
