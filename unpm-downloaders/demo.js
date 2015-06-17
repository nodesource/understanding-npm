const canvas      = document.body.appendChild(document.createElement('canvas'))
const camera      = require('canvas-orbit-camera')(canvas)
const gl          = require('gl-context')(canvas, render)
const gui         = require('gooey')().attach()
const eye         = require('eye-vector')
const mat4        = require('gl-matrix').mat4
const quat        = require('gl-matrix').quat
const packages    = require('@unpm/packages')(gl)
const downloaders = require('./')(gl, {
  dailyDownloads: 52685584,
  particles: packages.particles
})

packages.brightness = 4

const props = {
    width: 0
  , height: 0
  , view: new Float32Array(16)
  , proj: new Float32Array(16)
  , eye: new Float32Array(3)
  , fov: Math.PI / 4
  , near: 0.01
  , far: 100
  , radius: downloaders.radius
  , count: downloaders.count
  , size: downloaders.size
}

gui.add('fov', require('gooey/slider')(props.fov, 0, Math.PI))
gui.on('fov', fov => props.fov = fov)

gui.add('radius', require('gooey/slider')(props.radius, 0, 20))
gui.on('radius', r => downloaders.radius = r)
gui.add('count', require('gooey/slider')(props.count, 0, 32))
gui.on('count', c => downloaders.count = c)
gui.add('size', require('gooey/slider')(props.size, 0, 2))
gui.on('size', s => downloaders.size = s)

camera.distance = 30
quat.rotateY(camera.rotation, camera.rotation, Math.PI * 0.5)

const start = Date.now()

function render() {
  props.width  = gl.drawingBufferWidth
  props.height = gl.drawingBufferHeight
  props.ratio  = props.width / props.height
  props.time   = (Date.now() - start) / 1000

  gl.viewport(0, 0, props.width, props.height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  mat4.perspective(props.proj, props.fov, props.ratio, props.near, props.far)
  camera.view(props.view)
  camera.tick()
  eye(props.view, props.eye)

  downloaders.entry      = props.time
  downloaders.color1     = packages.color1
  downloaders.color2     = packages.color2
  downloaders.brightness = packages.brightness * 1.5

  downloaders.tick(props)
  downloaders.bind(props)
  downloaders.draw(props)
  downloaders.unbind(props)

  packages.tick(props)
  packages.bind(props)
  packages.draw(props)
  packages.unbind(props)
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)
