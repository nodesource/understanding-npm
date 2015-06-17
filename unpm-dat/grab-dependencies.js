module.exports = grabDependencies

function grabDependencies(name, pkg, out) {
  var latest  = pkg.versions[pkg['dist-tags'].latest]
  var deps    = Object.keys(latest.dependencies || {}).length
  var devDeps = Object.keys(latest.devDependencies || {}).length

  // workaround for hoarders and similar
  // packages throwing off the max dep counts
  if (deps > 500) deps = 0
  if (devDeps > 500) devDeps = 0

  out.dependencies = deps
  out.devDeps      = devDeps
}
