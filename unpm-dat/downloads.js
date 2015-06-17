const parallel = require('parallel-transform')
const sublevel = require('level-sublevel')
const rapid    = require('rapid-stream')
const sort     = require('sort-stream2')
const head     = require('head-stream')
const npm      = require('npm-stats')()
const json     = require('JSONStream')
const through  = require('through2')
const request  = require('request')
const level    = require('level')
const path     = require('path')
const Dat      = require('dat')
const fs       = require('fs')

const dat   = Dat(__dirname, kickOff)
const dbdir = path.join(__dirname, '.meta')
const db    = sublevel(level(dbdir, {
  valueEncoding: 'json'
}))

const counts = db.sublevel('counts')
const dates  = db.sublevel('dates')

const NO_STATS = 'no stats for this package for this range'
const WEEK     = 1000 * 60 * 60 * 24 * 7

function kickOff(err) {
  if (err) throw err

  const downloads = []

  dat.createReadStream()
    .pipe(rapid(20, grabDownloads))
    .pipe(sort(sorter))
    .pipe(slice(0, 256 * 128))
    .on('data', function(row) {
      downloads.push(row)
    })
    .on('end', function() {
      fs.writeFileSync(path.join(__dirname, 'data', '_downloads.json'), JSON.stringify(downloads))
      console.log('done!')
      console.log('writing data/_downloads.json')
      process.exit()
    })
}

function grabDownloads(name, _, next) {
  if (name._deleted) return next()
  if (!name['dist-tags']) return next()
  if (!name['dist-tags'].latest) return next()
  if (!name.key.indexOf('_design/')) return next()
  if (!name.time) return next()
  if (!name.time.created) return next()
  if (new Date(name.time.created).getFullYear() < 2009) return next()

  name = name.key

  if (name === 'bigben') return next()
  if (name === 'tld') return next()

  dates.get(name, function(err, date) {
    if (err) return ping()

    var since = Date.now() - new Date(date)
    if (since > WEEK) return ping()

    counts.get(name, function(err, count) {
      if (err) return next(err)

      next(null, {
        name: name,
        count: count
      })
    })
  })

  function ping() {
    request.get('https://api.npmjs.org/downloads/range/last-week/' + name.replace(/\//g, '%2F'), {
      json: true
    }, function(err, res, body) {
      if (err) return next(err)
      if (body.error && body.error.indexOf(NO_STATS) === -1) {
        return next(new Error(body.error + ' ('+name+')'))
      }

      var count = !body.error
        ? body.downloads.reduce(function(memo, day) {
          return memo + day.downloads
        }, 0) : 0

      counts.put(name, count, function(err) {
        if (err) return next(err)

        dates.put(name, Date.now(), function(err) {
          if (err) return next(err)

          console.error('retrieved:', name, '('+count+')')

          next(null, {
            name: name,
            count: count
          })
        })
      })
    })
  }
}

function sorter(a, b) {
  return b.count - a.count
}

function slice(a, b) {
  var count = 0

  return through.obj(function(chunk, _, next) {
    var curr = ++count
    if (curr < a) return next()
    if (curr > b) return next()
    next(null, chunk)
  })
}
