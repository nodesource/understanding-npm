const canvas   = document.body.appendChild(document.createElement('canvas'))
const gl       = require('gl-context')(canvas, render)
const display  = require('gl-texture2d-display')
const triangle = require('a-big-triangle')
const Texture  = require('gl-texture2d')
const Shader   = require('gl-shader')
const glBuffer = require('gl-buffer')
const glslify  = require('glslify')
const ndarray  = require('ndarray')
const FBO      = require('gl-fbo')
const VAO      = require('gl-vao')

const metaballs = {
  curr: FBO(gl, [128, 256], { float: true }),
  next: FBO(gl, [128, 256], { float: true }),
  draw: FBO(gl, [1, 1])
}

const metaBuffer = VAO(gl, [{
  buffer: glBuffer(gl, particleBuffer(128, 256))
  , size: 2
}])

const shaders = {
  logic: Shader(gl
    , glslify('./shaders/particle-step.vert')
    , glslify('./shaders/particle-step.frag')
  ),
  render: Shader(gl
    , glslify('./shaders/particle-draw.vert')
    , glslify('./shaders/particle-draw.frag')
  ),
  final: Shader(gl
    , glslify('./shaders/particle-pass.vert')
    , glslify('./shaders/particle-pass.frag')
  )
}

const start = Date.now()
const state = particleState(128, 256)

metaballs.curr.color[0].setPixels(state)
metaballs.next.color[0].setPixels(state)

function render() {
  const width  = gl.drawingBufferWidth
  const height = gl.drawingBufferHeight
  const dims   = [width, height]
  const now    = (Date.now() - start) / 1000

  // Metaball particle logic pass
  gl.viewport(0, 0, 128, 256)
  metaballs.next.bind()
  shaders.logic.bind()
  shaders.logic.uniforms.dims = [128, 256]
  shaders.logic.uniforms.map  = metaballs.curr.color[0].bind(0)
  shaders.logic.uniforms.time = now + 5000
  triangle(gl)

  // Metaball render pass
  metaballs.draw.bind()
  metaballs.draw.shape = dims
  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  shaders.render.bind()
  shaders.render.uniforms.dims = [128, 256]
  shaders.render.uniforms.map  = metaballs.curr.color[0].bind(0)
  metaBuffer.bind()
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
  gl.drawArrays(gl.POINTS, 0, 128 * 256)
  gl.disable(gl.BLEND)

  // Screen render pass (converts metaball map to hard edges)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, width, height)
  gl.clearColor(1, 1, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  shaders.final.bind()
  shaders.final.uniforms.map = metaballs.draw.color[0].bind(0)
  shaders.final.uniforms.dims = dims
  triangle(gl)

  // Pingpong FBOs for next logic pass
  var t = metaballs.next
  metaballs.next = metaballs.curr
  metaballs.curr = t
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)

function particleBuffer(w, h) {
  var data = new Float32Array(w * h * 2)
  var i = 0

  for (var y = 0; y < h; y++)
  for (var x = 0; x < w; x++) {
    data[i++] = x / (w-1)
    data[i++] = y / (h-1)
  }

  return data
}

function particleState(w, h) {
  var data = new Float32Array(w * h * 4)
  var i = 0

  for (var y = 0; y < h; y++)
  for (var x = 0; x < w; x++) {
    data[i++] = Math.random() - 0.5
    data[i++] = Math.random() - 0.5
    data[i++] = 0
    data[i++] = 1
  }

  return ndarray(data, [w, h, 4])
}
