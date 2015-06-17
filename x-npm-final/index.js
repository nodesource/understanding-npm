const canvas    = document.body.appendChild(document.createElement('canvas'))
const camera    = require('canvas-orbit-camera')(canvas)
const gl        = require('gl-context')(canvas, render)
const quat      = require('gl-matrix').quat
const Particles = require('gl-particles')
const Geom      = require('gl-geometry')
const eyevec    = require('eye-vector')
const icosphere = require('icosphere')
const Shader    = require('gl-shader')
const mat4      = require('gl-mat4')
const glslify   = require('glslify')

const start    = Date.now()
const registry = Geom(gl)
  .attr('position', icosphere(3))

const shaders = {
  registry: Shader(gl
    , glslify('./shaders/registry.vert')
    , glslify('./shaders/registry.frag')
  )
}

const particles = Particles(gl, {
  shape: [128, 256],
  logic: glslify('./shaders/particles.glsl'),
  vert: glslify('./shaders/particles.vert'),
  frag: glslify('./shaders/particles.frag')
})

particles.populate(function(u, v, data) {
  data[0] = (Math.random() - 0.5) * 0.1
  data[1] = (Math.random() - 0.5) * 0.1
  data[2] = (Math.random() - 0.5) * 0.1
  data[3] = 0
})

const model = new Float32Array(16)
const view  = new Float32Array(16)
const proj  = new Float32Array(16)
const eye   = new Float32Array(3)

camera.distance = 1.05

var regScale = 1

function render() {
  const width  = gl.drawingBufferWidth
  const height = gl.drawingBufferHeight

  mat4.identity(model)
  mat4.scale(model, model, [regScale, regScale, regScale])
  mat4.perspective(proj, Math.PI / 4, width / height, 0.01, 100)
  camera.view(view)
  camera.tick()
  eyevec(view, eye)

  camera.distance += (12 - camera.distance) * 0.005
  regScale = Math.max(0.05, regScale * 0.9955)
  quat.rotateZ(camera.rotation, camera.rotation, 0.001)
  quat.rotateY(camera.rotation, camera.rotation, 0.0025)

  gl.disable(gl.BLEND)
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  particles.step(function(uniforms) {
    uniforms.time = (Date.now() - start) / 1000
  })

  gl.viewport(0, 0, width, height)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.clearColor(0.135, 0.1, 0.2125, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  drawRegistry()
  drawParticles()
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)

function drawRegistry() {
  registry.bind(shaders.registry)
  shaders.registry.uniforms.model = model
  shaders.registry.uniforms.view  = view
  shaders.registry.uniforms.proj  = proj
  shaders.registry.uniforms.eye   = eye
  registry.draw()
}

function drawParticles() {
  gl.depthMask(false)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE)

  particles.draw(function(uniforms) {
    uniforms.proj = proj
    uniforms.view = view
    uniforms.eye  = eye
  })

  gl.depthMask(true)
  gl.disable(gl.BLEND)
}
