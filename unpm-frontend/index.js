const canvas   = document.body.appendChild(document.createElement('canvas'))
const gl       = require('gl-context')(canvas, render)
const gui      = require('gooey')().attach()
const identity = require('gl-mat4/identity')
const qs       = require('querystring')
const escape   = require('escape-html')
const comma    = require('comma-it')
const slice    = require('sliced')

const query = qs.parse(window.location.search.slice(1))
const unpm  = window.unpm = window.unpm || {}

const fetch      = unpm.fetch      = require('@unpm/fetch-data')
const story      = unpm.story      = require('@unpm/storyboard')
const background = unpm.background = require('@unpm/background')(gl)
const registry   = unpm.registry   = require('@unpm/registry')(gl)
const packages   = unpm.packages   = require('@unpm/packages')(gl)
const camera     = unpm.camera     = require('@unpm/camera')()
const stats      = unpm.stats      = require('@unpm/dat/stats.json')
const labels     = unpm.labels     = require('@unpm/labels')(gl)
const download   = unpm.download   = require('@unpm/downloaders')(gl, {
  dailyDownloads: stats['download-day'],
  particles: packages.particles
})

slice(
  document.querySelectorAll('[data-stats]')
).forEach(function(el) {
  const name  = el.getAttribute('data-stats')
  const value = stats[name]
  if (typeof value === 'undefined') return

  el.innerHTML = comma(value, {
    addPrecision: false,
    thousandSeperator: ',',
    decimalSeperator: '.'
  }).split('.')[0]
})

slice(
  document.querySelectorAll('[data-string]')
).forEach(function(el) {
  const name  = el.getAttribute('data-string')
  const value = stats[name]
  if (!value) return
  el.innerHTML = escape(value)
})

const start = Date.now()
const props = story.values = window.unpm.properties = {
  width: window.innerWidth,
  height: window.innerHeight,
  background: [0.05296948480730148, 0.03586927601097223, 0.12350080907344818],
  view: new Float32Array(16),
  proj: new Float32Array(16),
  model: new Float32Array(16),
  mvp: new Float32Array(16),
  eye: new Float32Array(3),
  fov: Math.PI / 4,
  near: 0.01,
  far: 100,
  cameraPosition: [-3.2835820895522403, -0.14925373134328268, 7.014925373134329],
  cameraTarget: [-1.7910447761194028, 0, 0],
  time: 0,
  dt: 0,
  packagesBrightness: 2,
  packagesColor1: new Float32Array([1.00, 0.45, 0.25]),
  packagesColor2: new Float32Array([0.15, 0.25, 0.65]),
  packagesRadius: 5,
  packagesLogScale: false,
  registryColor: new Float32Array([0.9, 0.55, 1.4]),
  registryScale: registry.scale,
  packagesMode: 'none',
  downloadEntry: 0,
  downloadExit: 0,
  downloadBeam: false,
  backgroundPosition: [0, 0, 0],
  backgroundRotation: 0,
  packagesMetric1: 'age',
  packagesMetric2: 'quality',
  packagesCategory: 'licenses',
  qualityThreshold: 0,
  visibleQuality: 0,
  highlightColor: [1, 0.1, 0.1]
}

const metrics = {
  'Package Quality': 'quality',
  'Description Length': 'descriptions',
  'README Length': 'readmes',
  'npm Script Count': 'scripts',
  'Dependency Count': 'dependencies',
  'Development Dependency Count': 'devDependencies',
  'Dependent Count': 'dependents',
  'Weekly Downloads': 'downloads',
  'Published Versions': 'versions',
  'GitHub Stars': 'stars',
  'Package Bundle Size': 'sizes',
  'First Published': 'created',
  'Last Published': 'modified',
  'Package Lifetime': 'lifetimes'
}

const metricIndex = Object.keys(metrics).reduce((memo, key) => {
  memo[metrics[key]] = key
  return memo
}, {})

const categories = {
  'License': 'licenses',
  'Package Name Prefix': 'prefixes'
}

var tweaked = false

;['x'
, 'y'
, 'category'
, 'log'
].forEach(name => {
  const el    = document.querySelector(`[name ="tweak-${name}"]`)
  const catEl = document.querySelector('[name ="tweak-category"]')

  if (el.nodeName === 'SELECT') {
    el.value = el.getAttribute('data-default')
  }

  el.addEventListener('change', e => {
    var category = catEl.value

    if (!tweaked) {
      document.body.classList.add('tweaked')
      tweaked = true
    }

    switch (name) {
      case 'x': props.packagesMetric1 = el.value; break
      case 'y': props.packagesMetric2 = el.value; break
      case 'log': props.packagesLogScale = el.checked; break
      case 'category':
        if (category === 'single') {
          props.packagesMode = 'plot'
          props.cameraPosition = [0, -1.2, -10]
        } else {
          props.packagesMode = 'multiples'
          props.packagesCategory = category
          props.cameraPosition = category === 'licenses'
            ? [0, -1.2, -27]
            : [0, 0, -55]
        }
      break
    }

    if (name !== 'log') {
      packages.tStart = Date.now()
      rebuildAxes(category)
    }
  }, false)
})

// TEMPORARY
function rebuildAxes(category) {
  labels.reset()

  var x = category === 'single'
    ? [0, -3, 0]
    : category === 'licenses'
    ? [0, -7.7, 0]
    : [0, -18, 0]

  var y = category === 'single'
    ? [+2.80, 0, 0]
    : category === 'licenses'
    ? [+7.50, 0, 0]
    : [+17.5, 0, 0]

  labels.addLabel(metricIndex[props.packagesMetric1], x, false)
  labels.addLabel(metricIndex[props.packagesMetric2], y, true)

  if (category === 'licenses') fetch.licenses.then(list => {
    Object.keys(list.index).forEach(name => {
      var idx = list.index[name]
      var col = Math.floor(idx / 3)
      var row = idx % 3

      if (name === 'null') name = 'Other'
      var x = (row-1)*5
      var y = (col-1)*5 // -2.85

      labels.addLabel(name, [x, y, 3], false, 0.75)
    })
  }).catch(err => {
    console.error(err)
  })

  if (category === 'prefixes') fetch.prefixes.then(list => {
    Object.keys(list.index).forEach(name => {
      var idx = list.index[name]
      var col = Math.floor(idx / 7)
      var row = idx % 7

      if (name === 'false') name = 'Other'
      var x = (row-3)*5
      var y = (col-3)*5 // -2.85

      labels.addLabel(name, [x, y, 3], false, 0.55)
    })
  }).catch(err => {
    console.error(err)
  })
}

gui.add('packagesMode', require('gooey/list')(props.packagesMode, {
  'Pause Motion': 'none',
  'Spherical Surface Test': 'test',
  'Attract to Center': 'zero',
  'Single Package': 'single',
  'Global Scatterplot': 'plot',
  'Small Multiples Scatterplot': 'multiples',
  'Quality Filter': 'quality'
})).on('packagesMode', m => props.packagesMode = m)

gui.add('packagesMetric1', require('gooey/list')(props.packagesMetric1, metrics))
  .on('packagesMetric1', m => ((props.packagesMetric1 = m), (packages.tStart = Date.now())))
gui.add('packagesMetric2', require('gooey/list')(props.packagesMetric2, metrics))
  .on('packagesMetric2', m => ((props.packagesMetric2 = m), (packages.tStart = Date.now())))
gui.add('packagesCategory', require('gooey/list')(props.packagesCategory, categories))
  .on('packagesCategory', c => ((props.packagesCategory = c), (packages.tStart = Date.now())))

gui.add('Display Text', require('gooey/toggle')(true)
   .on('change', _ => document.body.classList.toggle('invisible-text')))
gui.add('Display Labels', require('gooey/toggle')(true)
   .on('change', _ => document.body.classList.toggle('invisible-labels')))
gui.add('Log Scale', require('gooey/toggle')(props.packagesLogScale)
   .on('change', t => props.packagesLogScale = t))
gui.add('Display Navigation', require('gooey/toggle')(true)
   .on('change', _ => document.body.classList.toggle('invisible-navigation')))
gui.add('Draw/Tick Particles', require('gooey/toggle')(true)
   .on('change', t => packages.enabled = t))
gui.add('Draw/Tick Registry', require('gooey/toggle')(true)
   .on('change', t => registry.enabled = t))
gui.add('Draw/Tick Background', require('gooey/toggle')(true)
   .on('change', t => background.enabled = t))
gui.add('Draw/Tick Downloaders', require('gooey/toggle')(true)
   .on('change', t => download.enabled = t))
gui.add('downloadBeam', require('gooey/toggle')(false)
   .on('change', t => props.downloadBeam = t))

gui.add('registryColor', require('gooey/hsv')(props.registryColor, 0, 1))
gui.add('packagesColor1', require('gooey/hsv')(props.packagesColor1, 0, 1))
gui.add('packagesColor2', require('gooey/hsv')(props.packagesColor2, 0, 1))
gui.add('highlightColor', require('gooey/hsv')(props.highlightColor, 0, 1))

gui.add('packagesBrightness', require('gooey/slider')(props.packagesBrightness, 0, 10))
   .on('packagesBrightness', b => props.packagesBrightness = b)
gui.add('packagesRadius', require('gooey/slider')(props.packagesRadius, 0, 10))
   .on('packagesRadius', b => props.packagesRadius = b)

gui.add('cameraTarget', require('gooey/vector')(props.cameraTarget, -80, 80))
gui.add('cameraPosition', require('gooey/vector')(props.cameraPosition, -80, 80))
gui.add('backgroundPosition', require('gooey/vector')(props.backgroundPosition, -10, 10))
gui.add('backgroundRotation', require('gooey/slider')(props.backgroundRotation, -Math.PI, Math.PI))
    .on('backgroundRotation', r => props.backgroundRotation = r)
gui.add('visibleQuality', require('gooey/slider')(props.visibleQuality, 0, 6))
    .on('visibleQuality', q => props.visibleQuality = q)
gui.add('qualityThreshold', require('gooey/slider')(props.qualityThreshold, 0, 6))
    .on('qualityThreshold', q => props.qualityThreshold = q)

require('./story-nav')(story)
require('./pages/intro')(story, packages)
require('./pages/packages')(story, packages)
require('./pages/downloads')(story, download)
require('./pages/quality')(story, packages)
require('./pages/plots')(story, packages, labels)
require('./pages/licenses')(story, packages, labels)
require('./pages/prefixes')(story, packages, labels, gui)

story.jump(0)
gui.el.style.display = 'none'

var last = Date.now()

function render() {
  const now    = Date.now()
  props.time   = (now - start) / 1000
  props.dt     = (now - last)
  props.width  = gl.drawingBufferWidth
  props.height = gl.drawingBufferHeight

  story.tick(props.dt)
  last = now

  camera.position = props.cameraPosition
  camera.target = props.cameraTarget
  camera.view(props)

  registry.color = props.registryColor

  packages.highlightColor = props.highlightColor
  packages.visibleQuality = props.visibleQuality

  packages.logScale   = props.packagesLogScale
  packages.metrics[0] = props.packagesMetric1
  packages.metrics[1] = props.packagesMetric2
  packages.category   = props.packagesCategory
  packages.quality    = props.qualityThreshold
  packages.brightness = props.packagesBrightness
  packages.color1     = props.packagesColor1
  packages.color2     = props.packagesColor2
  packages.radius     = props.packagesRadius
  packages.mode       = props.packagesMode
  download.entry      = props.downloadEntry * (props.time - download.startTime)
  download.exit       = props.downloadExit * (props.time - download.endTime)
  download.beaming    = props.downloadBeam
  download.color1     = packages.color1
  download.color2     = packages.color2
  download.background = props.background
  download.brightness = props.packagesBrightness * 1.5
  background.position = props.backgroundPosition
  background.rotation = props.backgroundRotation

  gl.viewport(0, 0, props.width, props.height)
  gl.clearColor(props.background[0], props.background[1], props.background[2], 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  identity(props.model)

  if (background.enabled) {
    background(props)
  }

  if (registry.scale[0]
   && registry.scale[1]
   && registry.scale[2]
  ) drawSystem(registry)

  if (download.entry > 0
   && download.exit < 1
  ) drawSystem(download)

  drawSystem(packages)
  drawSystem(labels)
}

window.addEventListener('resize'
  , resize
  , false
)

var fitter = require('canvas-fit')(canvas)
function resize() {
  fitter()
  labels.refresh()
}

function drawSystem(system) {
  if (!system.enabled) return

  system.tick(props)
  system.bind(props)
  system.draw(props)
  system.unbind(props)
}

window.addEventListener('keydown', function(e) {
  var active = document.activeElement
  var select = active.nodeName === 'INPUT'
            || active.nodeName === 'SELECT'

  switch (e.keyCode) {
    case 72: // h
    case 75: // k
    case 37: // <left>
    case 38: // <up>
      if (!select) story.prev()
    break;

    case 39: // <right>
    case 40: // <down>
    case 76: // l
    case 74: // j
      if (!select) story.next()
    break;

    case 192: // ~
      gui.show()

      return gui.el.style.display = gui.el.style.display
        ? null
        : 'none'
    break;
  }
}, false)
