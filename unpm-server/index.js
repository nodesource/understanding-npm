const serve       = require('serve-static')
const compression = require('compression')
const browserify  = require('browserify')
const uglify      = require('uglify-js')
const watchify    = require('watchify')
const router      = require('course')()
const crypto      = require('crypto')
const mime        = require('mime')
const http        = require('http')
const path        = require('path')
const url         = require('url')
const fs          = require('fs')

const PORT       = process.env.PORT || 9966
const gzip       = compression({ filter: _ => true })
const HARD_CACHE = 1000 * 60 * 60 * 24 * 7 * 365.25
const SOFT_CACHE = 1000 * 60 * 60 * 24
const START_TIME = new Date

var bundler = browserify(require.resolve('@unpm/frontend'), {
  packageCache: {},
  fullPaths: process.env.NODE_ENV !== 'production',
  cache: {}
})

var index     = new Buffer(require('@unpm/frontend/inline')())
var indexHash = JSON.stringify(crypto.createHash('md5')
  .update(index)
  .digest('hex'))

router.get(function(req, res, next) {
  res.setHeader('X-Accel-Expires', '15')
  next()
})

// Health check
router.get('/ok', function(req, res) {
  res.end('OK')
})

router.get('/', gzip, function(req, res) {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['if-none-match'] === indexHash) {
      res.statusCode = 304
      return res.end()
    }

    res.setHeader('last-modified', String(START_TIME))
    res.setHeader('etag', indexHash)
  }

  res.setHeader('content-type', 'text/html;charset=utf-8')
  res.end(process.env.NODE_ENV !== 'production'
    ? require('@unpm/frontend/inline')()
    : index
  )
})

router.get('/share.jpg', serveFile(require.resolve('@unpm/frontend/share.jpg')))
router.get('/favicon.ico', cache(2592000000), serveFile(require.resolve('@unpm/frontend/favicon.ico')))
router.get('/data/created.bin', serveFile(require.resolve('@unpm/dat/data/created.bin')))
router.get('/data/modified.bin', serveFile(require.resolve('@unpm/dat/data/modified.bin')))
router.get('/data/sizes.bin', gzip, serveFile(require.resolve('@unpm/dat/data/sizes.bin')))
router.get('/data/stars.bin', gzip, serveFile(require.resolve('@unpm/dat/data/stars.bin')))
router.get('/data/readmes.bin', gzip, serveFile(require.resolve('@unpm/dat/data/readmes.bin')))
router.get('/data/scripts.bin', gzip, serveFile(require.resolve('@unpm/dat/data/scripts.bin')))
router.get('/data/quality.bin', gzip, serveFile(require.resolve('@unpm/dat/data/quality.bin')))
router.get('/data/versions.bin', gzip, serveFile(require.resolve('@unpm/dat/data/versions.bin')))
router.get('/data/licenses.bin', gzip, serveFile(require.resolve('@unpm/dat/data/licenses.bin')))
router.get('/data/prefixes.bin', gzip, serveFile(require.resolve('@unpm/dat/data/prefixes.bin')))
router.get('/data/dev-deps.bin', gzip, serveFile(require.resolve('@unpm/dat/data/dev-deps.bin')))
router.get('/data/licenses.json', gzip, serveFile(require.resolve('@unpm/dat/data/licenses.json')))
router.get('/data/prefixes.json', gzip, serveFile(require.resolve('@unpm/dat/data/prefixes.json')))
router.get('/data/downloads.bin', gzip, serveFile(require.resolve('@unpm/dat/data/downloads.bin')))
router.get('/data/dependents.bin', gzip, serveFile(require.resolve('@unpm/dat/data/dependents.bin')))
router.get('/data/dependencies.bin', gzip, serveFile(require.resolve('@unpm/dat/data/dependencies.bin')))
router.get('/data/descriptions.bin', gzip, serveFile(require.resolve('@unpm/dat/data/descriptions.bin')))
router.get('/fonts/icons.eot', gzip, cache(604800000), serveFile(require.resolve('@nsight/header/fonts/icons.eot')))
router.get('/fonts/icons.ttf', gzip, cache(604800000), serveFile(require.resolve('@nsight/header/fonts/icons.ttf')))
router.get('/fonts/icons.svg', gzip, cache(604800000), serveFile(require.resolve('@nsight/header/fonts/icons.svg')))
router.get('/fonts/icons.woff', gzip, cache(604800000), serveFile(require.resolve('@nsight/header/fonts/icons.woff')))

var prebundle

if (process.env.NODE_ENV !== 'production') {
  bundler = watchify(bundler)
} else {
  bundler.bundle(function(err, bundle) {
    if (err) console.error(err)

    bundle = String(bundle)
    bundle = uglify.minify(bundle, {
      fromString: true,
      mangle: true,
      compress: true,
      ie_proof: false,
      semicolons: false
    }).code

    prebundle = bundle
  })
}

router.get('/bundle.js', gzip, function(req, res, next) {
  res.setHeader('content-type', 'text/javascript')
  res.setHeader('cache-control', 'public, max-age='+SOFT_CACHE/1000)
  res.setHeader('expires', new Date(Date.now() + SOFT_CACHE))

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('last-modified', String(START_TIME))
  }

  if (prebundle) {
    res.setHeader('content-length', prebundle.length)
    return res.end(prebundle)
  }

  bundler.bundle(function(err, content) {
    if (err) return next(err)
    res.setHeader('content-length', content.length)
    res.end(content)
  })
})

http.createServer(function(req, res) {
  setHardCache(req, res)
  router(req, res, function(err) {
    if (err) return bail(err, req, res)

    res.setHeader('content-type', 'text/plain')
    res.statusCode = 404
    res.end('404: ' + req.url)
  })
}).listen(PORT, function(err) {
  if (err) throw err
  console.log('http://localhost:'+PORT)
})

function serveFile(file) {
  var buffer  = fs.readFileSync(file)
  var stats   = fs.statSync(file)
  var type    = mime.lookup(file)
  var mtime   = String(stats.mtime)

  if (type === 'text/html' || type === 'text/javascript') {
    type += ';charset=utf8'
  }

  return function handle(req, res, next) {
    if (process.env.NODE_ENV === 'development') {
      buffer = fs.readFileSync(file)
    }

    res.setHeader('last-modified', mtime)
    res.setHeader('content-length', buffer.length)
    res.setHeader('content-type', type)
    res.end(buffer)
  }
}

function bail(err, req, res) {
  res.statusCode = 500
  res.setHeader('content-type', 'text/plain')
  res.end([err.message, err.stack].join('\n'))
}

// Hard cached assets: include a hex hash before
// the file extension, rewriting said hash away if it's found.
// e.g. `/bundle.af830cd.css` becomes `/bundle.css`
// Any assets served like this are cached more or less indefinitely.
function setHardCache(req, res) {
  var regex = /\.([a-f0-9]{6,})\.([a-z]{2,5})$/ig
  var uri   = url.parse(req.url)

  if (!regex.test(uri.pathname)) return
  uri.pathname = uri.pathname.replace(regex, '.$2')
  uri = req.url = url.format(uri)

  res.setHeader('cache-control', 'public, max-age='+HARD_CACHE/1000)
  res.setHeader('expires', new Date(Date.now() + HARD_CACHE))
}

function cache(duration) {
  if (process.env.NODE_ENV !== 'production') return (a, b, next) => next()

  return function(req, res, next) {
    res.setHeader('cache-control', 'public, max-age='+duration/1000)
    res.setHeader('expires', new Date(Date.now() + duration))
    next()
  }
}
