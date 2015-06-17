const canvas     = document.body.appendChild(document.createElement('canvas'))
const gl         = require('gl-context')(canvas, render)
const camera     = require('lookat-camera')()
const Geom       = require('gl-geometry')
const Shader     = require('gl-shader')
const mat4       = require('gl-mat4')
const glslify    = require('glslify')
const bunny      = require('bunny')
const storyboard = require('./')

const geom   = Geom(gl).attr('position', bunny)
const shader = Shader(gl
  , glslify('./demo.vert')
  , glslify('./demo.frag')
)

const proj = mat4.create()
const view = mat4.create()

storyboard.values = {
  position: [0, 0, 0],
  center: [0, 0, 0]
}

storyboard.push({
  position: {
    value: [0, 0, 2],
    duration: 500,
    ease: require('eases/quart-in-out')
  },
  center: {
    value: [0, 0, 0],
    duration: 500,
    delay: 500,
    ease: require('eases/quart-in-out')
  }
}).on('enter', function() {
  console.log('~~ Entering first page')
}).on('exit', function() {
  console.log('?? Exiting first page')
})

storyboard.push({
  position: {
    value: [0, 0, 50],
    duration: 1000,
    ease: require('eases/elastic-out')
  }
}, {
  position: {
    value: [30, 0, 10],
    duration: 1000,
    ease: require('eases/back-in-out')
  }
})

storyboard.push({
  center: {
    value: [0, 10, 0],
    duration: 1000,
    ease: require('eases/sine-in-out')
  }
}).on('enter', function() {
  console.log('>> Moving down')
}).on('exit', function() {
  console.log('<< Zooming in')
})

storyboard.jump(0)
setInterval(function() {
  storyboard.next()
}, 1000)

var last = Date.now()

function render() {
  const width  = gl.drawingBufferWidth
  const height = gl.drawingBufferHeight
  const now    = Date.now()
  const dt     = now - last

  last = now
  storyboard.tick(dt)

  gl.viewport(0, 0, width, height)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  camera.position = storyboard.values.position
  camera.target   = storyboard.values.center

  mat4.perspective(proj, Math.PI / 4, width / height, 0.01, 100)
  camera.view(view)

  geom.bind(shader)
  shader.uniforms.proj = proj
  shader.uniforms.view = view
  geom.draw()
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)
