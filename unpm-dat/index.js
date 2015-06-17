const stars     = require('./data/_stars.json')
const parallel  = require('parallel-transform')
const concat    = require('concat-stream')
const rapid     = require('rapid-stream')
const IndexList = require('index-list')
const json      = require('JSONStream')
const mkdirp    = require('mkdirp')
const after     = require('after')
const path      = require('path')
const Dat       = require('dat')
const fs        = require('fs')

const grab = {
  dependencies: require('./grab-dependencies'),
  descriptions: require('./grab-descriptions'),
  versions: require('./grab-versions'),
  quality: require('./grab-quality'),
  license: require('./grab-license'),
  scripts: require('./grab-scripts'),
  readmes: require('./grab-readmes'),
  prefix: require('./grab-prefix'),
  sizes: require('./grab-sizes'),
  ages: require('./grab-ages')
}

const depIndex = {}

const dat = Dat(__dirname, function(err) {
  if (err) throw err

  var n = 0
  var starsIndex = stars.reduce(function(memo, row) {
    memo[row.name] = row.count
    return memo
  }, {})

  fs.createReadStream(path.join(__dirname, 'data', '_downloads.json'))
    .pipe(json.parse([true]))
    .pipe(rapid(100, grabMeta))
    .pipe(rapid(10, map))
    .pipe(concat(reduce))

  function grabMeta(row, _, next) {
    if (!(n++%100)) {
      process.stdout.write((100*n/256/128).toFixed(3)+'% ' + row.name + '                                          \r')
    }


    dat.get(row.name, function(err, pkg) {
      if (err) return next(err)

      pkg.downloads = row.count
      pkg.stars = starsIndex[row.name]

      var latest = pkg.versions[pkg['dist-tags'].latest]
      ;[]
        .concat(Object.keys(latest.dependencies || {}))
        .concat(Object.keys(latest.devDependencies || {}))
        .forEach(function(name) {
          depIndex[name] = depIndex[name] || { value: 0 }
          depIndex[name].value++
        })

      next(null, pkg)
    })
  }

  function map(pkg, _, next) {
    var out = { name: pkg.name }

    out.dependents = depIndex[pkg.name] = depIndex[pkg.name] || { value: 0 }
    out.downloads  = pkg.downloads
    out.stars      = pkg.stars

    grab.license(pkg.name, pkg, out)
    grab.prefix(pkg.name, pkg, out)
    grab.scripts(pkg.name, pkg, out)
    grab.sizes(pkg.name, pkg, out)
    grab.readmes(pkg.name, pkg, out)
    grab.descriptions(pkg.name, pkg, out)
    grab.dependencies(pkg.name, pkg, out)
    grab.versions(pkg.name, pkg, out)
    grab.ages(pkg.name, pkg, out)

    grab.quality(pkg.name, pkg, out)

    next(null, out)
  }

  function reduce(results) {
    var dirname      = path.join(__dirname, 'data')
    var dependencies = results.map(function(d) { return d.dependencies })
    var descriptions = results.map(function(d) { return d.description })
    var downloads    = results.map(function(d) { return d.downloads })
    var versions     = results.map(function(d) { return d.versions })
    var modified     = results.map(function(d) { return d.modified })
    var created      = results.map(function(d) { return d.created })
    var quality      = results.map(function(d) { return d.quality })
    var scripts      = results.map(function(d) { return d.scripts })
    var licenses     = results.map(function(d) { return d.license })
    var devDeps      = results.map(function(d) { return d.devDeps })
    var prefixes     = results.map(function(d) { return d.prefix })
    var readmes      = results.map(function(d) { return d.readme })
    var stars        = results.map(function(d) { return d.stars })
    var names        = results.map(function(d) { return d.name })
    var sizes        = results.map(function(d) { return d.size })
    var dependents   = results.map(function(d) { return d.dependents.value })

    fs.writeFileSync(path.join(dirname, 'names.json'), JSON.stringify(names))

    // Writes numerical data as raw binary, to be
    // loaded up into a Typed Array on the client
    // via xhr
    var quantities = {}

    quantities.downloads    = [downloads, Uint32Array]
    quantities.stars        = [stars, Uint32Array]
    quantities.scripts      = [scripts, Uint8Array]
    quantities.sizes        = [sizes, Uint32Array]
    quantities.readmes      = [readmes, Uint32Array]
    quantities.created      = [created, Float32Array]
    quantities.modified     = [modified, Float32Array]
    quantities.descriptions = [descriptions, Uint32Array]
    quantities.dependencies = [dependencies, Uint32Array]
    quantities.dependents   = [dependents, Uint32Array]
    quantities['dev-deps']  = [devDeps, Uint32Array]
    quantities.versions     = [versions, Uint32Array]
    quantities.quality      = [quality, Uint8Array]

    Object.keys(quantities).forEach(function(key) {
      var data   = quantities[key][0]
      var TArray = quantities[key][1]
      var bytes  = new Uint8Array(new TArray(data).buffer)
      var buffer = new Buffer(bytes)

      fs.writeFileSync(path.join(dirname, key + '.bin'), buffer)
    })

    // Writes indexed lists as JSON/binary pairs,
    // intended for categorical data.
    var indexes = {
      licenses: top(9, IndexList(licenses), 'null'),
      prefixes: top(49, IndexList(prefixes), 'false')
    }

    Object.keys(indexes).forEach(function(key) {
      var list   = indexes[key]
      var keys   = JSON.stringify(list.index)
      var vals   = new Uint8Array(list.items)
      var buffer = new Buffer(vals)

      fs.writeFileSync(path.join(dirname, key + '.bin'), buffer)
      fs.writeFileSync(path.join(dirname, key + '.json'), keys)
    })

    console.log()
    console.log('all done!')
    process.exit()
  }
})

function top(limit, list, fallback) {
  // cull to the top `limit` categories in the list
  var lookup = list.lookup
  var index  = list.index
  var items  = list.items
  var count  = {}

  fallback = index[fallback]

  for (var i = 0; i < items.length; i++) {
    var key = lookup[items[i]]
    count[key] = count[key] || 0
    count[key]++
  }

  var top = Object.keys(count).map(function(key) {
    return { name: key, count: count[key] }
  }).sort(function(a, b) {
    return b.count - a.count
  }).slice(0, limit).reduce(function(memo, row) {
    memo[row.name] = row.count
    return memo
  }, {})

  for (var i = 0; i < items.length; i++) {
    var idx = items[i]
    var key = lookup[idx]
    if (key in top) continue
    items[i] = fallback
  }

  // trim out extraneous ids
  var nIndex  = {}
  var nLookup = {}
  var map     = {}
  var n       = 0

  Object.keys(lookup).forEach(function(idx) {
    if (!(lookup[idx] in top)) return

    map[idx] = n++

    var key = lookup[idx]
    nLookup[map[idx]] = key
    nIndex[key] = map[idx]
  })

  for (var i = 0; i < items.length; i++) {
    items[i] = map[items[i]]
  }

  list.index  = nIndex
  list.lookup = nLookup

  return list
}
