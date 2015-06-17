const npm     = require('npm-stats')()
const json    = require('JSONStream')
const request = require('request')
const cheerio = require('cheerio')
const after   = require('after')
const path    = require('path')
const fs      = require('fs')

const stats = module.exports = {}
const next  = after(4, done)

crawlNpm(next)
countPublishes(next)
getQualityCount(next)
getDownloadStarContrast(next)

function crawlNpm(next) {
  request.get('https://npmjs.com/', function(err, res, body) {
    if (err) return next(err)

    const $ = cheerio.load(body+'')
    const dls   = $('.icon-cal-7days .pretty-number')[0]
    const total = $('.icon-package-hex .total-packages')[0]

    stats['total']         = Number($(total).text())
    stats['download-week'] = Number($(dls).text())
    stats['download-day']  = Math.floor(stats['download-week'] / 7)

    next()
  })
}

function countPublishes(next) {
  const now      = new Date()
  const lastWeek = new Date(now - 1000 * 60 * 60 * 24 * 7)

  var published = 0

  npm.listByDate({
    since: +lastWeek,
    until: +now
  }).pipe(json.parse([true]))
    .on('data', function(row) { published++ })
    .once('end', function() {
      stats['publish-rate'] = published
      next()
    })
}

function getQualityCount(next) {
  fs.readFile(path.join(__dirname, 'data', 'quality.bin'), function(err, data) {
    if (err) return next(err)

    var count = 0

    stats['quality-1'] =
    stats['quality-2'] =
    stats['quality-3'] =
    stats['quality-4'] =
    stats['quality-5'] = 0

    for (var i = 0; i < data.length; i++) {
      for (var j = 1; j <= data[i]; j++) {
        stats['quality-' + j]++
      }

      if (data[i] === 5) count++
    }

    for (var j = 1; j <= 5; j++) {
      var k = 'quality-' + j
      stats[k + '-percent'] = j > 1
        ? (100 * stats[k] / stats['quality-1']).toFixed(1) + '%'
        : '100%'
    }

    next()
  })
}

function getDownloadStarContrast(next) {
  var downloads = require('./data/_downloads.json')
  var stars     = require('./data/_stars.json')

  var starIndex = stars.reduce(function(memo, row) {
    memo[row.name] = row.count
    return memo
  }, {})


  downloads.sort(function(a, b) {
    a.stars = starIndex[a.name]
    b.stars = starIndex[b.name]
    a.ratio = a.count / a.stars
    b.ratio = b.count / b.stars
    return b.count - a.count
  })

  var topIgnored = downloads.filter(function(pkg) {
    return pkg.count > 875000
  }).slice(0, 100).sort(function(a, b) {
    return b.ratio - a.ratio
  }).filter(function(pkg) {
    return pkg.ratio !== Infinity
  })

  stats['ignored-name'] = topIgnored[0].name
  stats['ignored-stars'] = topIgnored[0].stars
  stats['ignored-downloads'] = topIgnored[0].count

  var topInflated = downloads.filter(function(pkg) {
    return pkg.name.indexOf('lodash')            // some of these are single-repo, multi-package
        && pkg.name !== 'teambition-ui'          // projects which get very little downloads for
        && pkg.name.indexOf('bootstrap') === -1  // individual projects despite being useful overall
        && pkg.name.indexOf('angular') === -1
        && pkg.name.indexOf('three') === -1
        && pkg.name.indexOf('foundation') === -1
        && pkg.name !== 'airbnb-style'
        && pkg.ratio < 1
        && pkg.count < 350
  }).sort(function(a, b) {
    return b.stars - a.stars
  }).slice(0, 500).sort(function(a, b) {
    return a.ratio - b.ratio
  })

  stats['inflated-name'] = topInflated[0].name
  stats['inflated-stars'] = topInflated[0].stars
  stats['inflated-downloads'] = topInflated[0].count

  next()
}

function done(err) {
  if (err) throw err
  console.log(stats)
  fs.writeFileSync(path.join(__dirname, 'stats.json'), JSON.stringify(stats))
  console.log('done!')
}
