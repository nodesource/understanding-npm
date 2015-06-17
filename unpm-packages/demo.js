const canvas   = document.body.appendChild(document.createElement('canvas'))
const camera   = require('canvas-orbit-camera')(canvas)
const gl       = require('gl-context')(canvas, render)
const gui      = require('gooey')().attach()
const eye      = require('eye-vector')
const mat4     = require('gl-mat4')
const packages = require('./')(gl)

const props = {
    start: Date.now()
  , width: 0
  , height: 0
  , time: 0
  , view: new Float32Array(16)
  , proj: new Float32Array(16)
  , eye: new Float32Array(3)
  , fov: Math.PI / 4
  , near: 0.01
  , mode: 'test'
  , far: 100
}

gui.add('brightness', require('gooey/slider')(2, 0, 5))
gui.add('color1', require('gooey/rgb')(packages.color1, 0, 1))
gui.add('color2', require('gooey/rgb')(packages.color2, 0, 1))
gui.add('fov', require('gooey/slider')(props.fov, 0, Math.PI))
gui.add('mode', require('gooey/list')(props.mode, {
  'Package Flood': 'flood',
  'Test': 'test',
  'Plot': 'plot'
}))

gui.on('brightness', brightness => packages.brightness = brightness)
gui.on('mode', mode => ((packages.mode = mode), packages.tStart = Date.now()))
gui.on('fov', fov => props.fov = fov)

camera.distance = 20

function render() {
  props.width  = gl.drawingBufferWidth
  props.height = gl.drawingBufferHeight
  props.ratio  = props.width / props.height
  props.time   = (Date.now() - props.start) / 1000

  gl.viewport(0, 0, props.width, props.height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  mat4.perspective(props.proj, props.fov, props.ratio, props.near, props.far)
  camera.view(props.view)
  camera.tick()
  eye(props.view, props.eye)

  packages.tick(props)
  packages.bind(props)
  packages.draw(props)
  packages.unbind(props)
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)
