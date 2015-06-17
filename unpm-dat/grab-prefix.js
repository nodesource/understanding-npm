module.exports = grabPrefix

function grabPrefix(name, pkg, out) {
  var parts = name.toLowerCase().split(/\W/g)

  out.prefix = parts.length > 1 && parts[0]
}
