const normalize = require('normalize-package-data')
const parallel  = require('parallel-transform')
const gitInfo   = require('hosted-git-info')
const sublevel  = require('level-sublevel')
const rapid     = require('rapid-stream')
const sort      = require('sort-stream2')
const json      = require('JSONStream')
const through   = require('through2')
const request   = require('request')
const ghauth    = require('ghauth')
const level     = require('level')
const path      = require('path')
const url       = require('url')
const fs        = require('fs')

const WEEK  = 1000 * 60 * 60 * 24 * 7
const dat   = require('dat')(__dirname, kickOff)
const dbdir = path.join(__dirname, '.stars')
const db    = sublevel(level(dbdir, {
  valueEncoding: 'json'
}))

const counts = db.sublevel('counts')
const dates  = db.sublevel('dates')

var token = null

function kickOff(err) {
  if (err) throw err

  ghauth({
    configName: 'unpm',
    scopes: ['user'],
    note: 'npm data aggregation project',
    userAgent: 'unpm'
  }, function(err, authData) {
    if (err) throw err

    var stars = []
    var count = 0

    token = authData.token

    fs.createReadStream(path.join(__dirname, 'data', '_downloads.json'))
      .pipe(json.parse([true]))
      .pipe(rapid(100, grabMeta))
      .pipe(rapid(20, grabStars))
      .on('data', function(row) {
        console.log((100*(count++)/256/128).toFixed(3) + '%', row.name)
        stars.push(row)
      })
      .once('end', function() {
        fs.writeFileSync(path.join(__dirname, 'data', '_stars.json'), JSON.stringify(stars))
      })
  })

  function grabMeta(row, _, next) {
    dat.get(row.name, next)
  }

  function grabStars(pkg, _, next) {
    if (pkg._deleted) return next()
    if (!pkg['dist-tags']) return next()
    if (!pkg['dist-tags'].latest) return next()
    if (!pkg.key.indexOf('_design/')) return next()

    var name = pkg.name

    dates.get(name, function(err, date) {
      if (err) return ping(pkg)

      var since = Date.now() - new Date(date)
      if (since > WEEK * 99) return ping(pkg)

      counts.get(name, function(err, count) {
        if (err) return ping(pkg)

        next(null, {
          name: name,
          count: count
        })
      })
    })

    function ping(pkg) {
      pkg._id = pkg.name
      pkg.version = pkg['dist-tags'].latest
      pkg.repository = pkg.repository || {}

      var uri = typeof pkg.repository === 'string'
        ? pkg.repository
        : pkg.repository.type === 'git' && pkg.repository.url

      if (!uri) return submit(0)

      var info = gitInfo.fromUrl(uri)
      if (!info) return submit(0)
      if (info.type !== 'github') return submit(0)

      request.get('https://api.github.com/repos/'+info.user+'/'+info.project, {
        json: true,
        headers: {
          'Authorization': 'token ' + token,
          'User-Agent': 'unpm'
        }
      }, function(err, res, body) {
        if (err) return next(err)

        var reset  = parseInt(res.headers['x-ratelimit-reset'], 10) * 1000 || Date.now()
        var remain = parseInt(res.headers['x-ratelimit-remaining'], 10)
        var delay  = (reset - Date.now()) / remain

        delay = remain < 1500 ? delay * 30 : delay * 10

        console.log('retrieved:', name, '('+(body && body.stargazers_count)+')')
        console.log('remaining:', remain)
        console.log('limit delay:', delay)

        setTimeout(function() {
          if (err) return next(err)
          if (!body) return submit(0)
          if ('stargazers_count' in body) {
            return submit(body.stargazers_count)
          }

          if (body.message === 'Not Found') {
            return submit(0)
          }

          return next(new Error(body.message))
        }, delay)
      })

      // next()
      // request.get('https://api.github.com/repos/')
    }

    function submit(count) {
      counts.put(name, count, function(err) {
        if (err) return next(err)

        dates.put(name, Date.now(), function(err) {
          if (err) return next(err)

          next(null, {
            name: name,
            count: count
          })
        })
      })
    }
  }
}

function sorter(a, b) {
  return b.count - a.count
}
