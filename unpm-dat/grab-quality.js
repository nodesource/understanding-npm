module.exports = grabQuality

function grabQuality(name, pkg, out) {
  out.quality = 1

  // No README?
  if (!pkg.readme || !String(pkg.readme).trim()) return
  if (pkg.readme === 'ERROR: No README data found!') return

  out.quality++

  // No license in package.json?
  if (!out.license) return

  out.quality++

  // No git repository included?
  if (!pkg.repository) return
  if (typeof pkg.repository !== 'string' && !pkg.repository.url) return

  var latest = pkg.versions[pkg['dist-tags'].latest]
  if (!latest) return

  out.quality++

  // No tests?
  if (!latest.scripts) return
  if (!latest.scripts.test) return
  if (latest.scripts.test === '"echo \"Error: no test specified\" && exit 1"') return

  out.quality++
}
