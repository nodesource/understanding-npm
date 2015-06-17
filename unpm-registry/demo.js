const canvas   = document.body.appendChild(document.createElement('canvas'))
const camera   = require('canvas-orbit-camera')(canvas)
const gl       = require('gl-context')(canvas, render)
const gui      = require('gooey')().attach()
const eye      = require('eye-vector')
const mat4     = require('gl-mat4')
const registry = require('./')(gl)

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

gui.add('fov', require('gooey/slider')(props.fov, 0, Math.PI))
gui.on('fov', fov => props.fov = fov)

camera.distance = 4

function render() {
  props.width  = gl.drawingBufferWidth
  props.height = gl.drawingBufferHeight
  props.ratio  = props.width / props.height

  gl.viewport(0, 0, props.width, props.height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  mat4.perspective(props.proj, props.fov, props.ratio, props.near, props.far)
  camera.view(props.view)
  camera.tick()
  eye(props.view, props.eye)

  registry.tick(props)
  registry.bind(props)
  registry.draw(props)
  registry.unbind(props)
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)
