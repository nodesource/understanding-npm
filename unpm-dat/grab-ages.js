module.exports = grabAges

// just an early reference point for
// scaling values by
var start = new Date(2009, 1, 1)

function grabAges(name, pkg, out) {
  var ctime = new Date(pkg.time ? pkg.time.created : pkg.ctime)
  var mtime = new Date(pkg.time ? pkg.time.modified : pkg.mtime)

  if (ctime < start) throw new Error(name +':'+ pkg.time.created || pkg.ctime)
  if (mtime < start) throw new Error(name +':'+ pkg.time.modified || pkg.mtime)

  out.created  = Math.max(0, ctime - start) / 1000
  out.modified = Math.max(0, mtime - start) / 1000
}
