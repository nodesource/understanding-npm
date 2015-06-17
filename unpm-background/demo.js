const canvas      = document.body.appendChild(document.createElement('canvas'))
const camera      = require('canvas-orbit-camera')(canvas)
const gl          = require('gl-context')(canvas, render)
const gui         = require('gooey')().attach()
const eye         = require('eye-vector')
const mat4        = require('gl-matrix').mat4
const quat        = require('gl-matrix').quat
const background  = require('./')(gl)

const props = {
    width: 0
  , height: 0
  , view: new Float32Array(16)
  , proj: new Float32Array(16)
  , eye: new Float32Array(3)
  , fov: Math.PI / 4
  , near: 0.01
  , far: 100
}

camera.distance = 30

gui.toggle()
gui.add('position', require('gooey/vector')([0, 0, 0], -30, 30))
   .on('position', p => background.position = p)
gui.add('rotation', require('gooey/slider')(0, -Math.PI * 2, Math.PI * 2))
   .on('rotation', r => background.rotation = r)

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

  background(props)
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)
