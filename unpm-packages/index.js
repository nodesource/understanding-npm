const fetch     = require('@unpm/fetch-data')
const System    = require('@unpm/system')
const Particles = require('gl-particles')
const Texture   = require('gl-texture2d')
const Shader    = require('gl-shader')
const glslify   = require('glslify')
const ndarray   = require('ndarray')

module.exports = gl => new Packages(gl)

const logicSources = {
  test: glslify('./logic-test.glsl'),
  none: glslify('./logic-none.glsl'),
  zero: glslify('./logic-zero.glsl'),
  plot: glslify('./logic-plot.glsl'),
  flood: glslify('./logic-flood.glsl'),
  single: glslify('./logic-single.glsl'),
  quality: glslify('./logic-quality.glsl'),
  multiples: glslify('./logic-multiples.glsl')
}

const logicVertex = `
precision mediump float;

attribute vec2 position;

void main() {
  gl_Position = vec4(position, 1, 1);
}
`

class Packages extends System {
  constructor(gl) {
    super(gl)

    this.brightness = 1

    this.mode = 'test'
    this.shaders = {}
    this.color1  = new Float32Array([1.00, 0.45, 0.25])
    this.color2  = new Float32Array([0.15, 0.25, 0.65])
    this.radius  = 5
    this.shape   = [128, 256]
    this.tStart  = Date.now()
    this.quality = 1
    this.metrics = [null, null]

    this.particles = Particles(gl, {
      shape: this.shape,
      logic: logicSources.test,
      vert: glslify('./render.vert'),
      frag: glslify('./render.frag')
    })

    this.logScale       = false
    this.visibleQuality = 0
    this.metricScale    = new Float32Array([1, 1, 1, 1])
    this.statsMin       = { age: 0 }
    this.statsMax       = { age: 1 }
    this.category       = null
    this.categories     = {}
    this.categoryCounts = {}
    this.stats          = {
      age: bogusAges(gl, this.shape)
    }

    Object.keys(logicSources).forEach(key => {
      this.shaders[key] = Shader(gl
        , this.particles.logicVertSource
        , logicSources[key]
      )
    })

    this.resetPositions()

    Object.keys(fetch).forEach(key => {
      fetch[key].then(value => {
        if ('length' in value) {
          this.stats[key] = createTexture(gl, value, this.shape)
          this.statsMin[key] = getMin(value)
          this.statsMax[key] = getMax(value)
        } else {
          var count = Object.keys(value.index).length
          this.categories[key] = createTexture(gl, value.items, this.shape)
          this.categoryCounts[key] = [Math.sqrt(count), Math.sqrt(count)]
        }
      })
    })
  }

  tick(props) {
    const gl = this.gl

    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)

    this.particles.logic = this.shaders[this.mode]
    this.particles.step(uniforms => {
      uniforms.time   = (Date.now() - this.tStart) / 1000
      uniforms.radius = this.radius
      uniforms.isLog  = this.logScale

      var c  = this.category
      var m1 = this.metrics[0]
      var m2 = this.metrics[1]
      if (m1 && this.stats[m1]) uniforms.metric1 = this.stats[m1].bind(1)
      if (m2 && this.stats[m2]) uniforms.metric2 = this.stats[m2].bind(2)
      if (c && this.categories[c]) {
        uniforms.category      = this.categories[c].bind(3)
        uniforms.categoryCount = this.categoryCounts[c]
      }

      this.metricScale[0] = this.statsMin[m1] || 0
      this.metricScale[1] = this.statsMax[m1] || 0
      this.metricScale[2] = this.statsMin[m2] || 0
      this.metricScale[3] = this.statsMax[m2] || 0
      uniforms.metricScale = this.metricScale

      uniforms.qualityThreshold = this.quality
    })
  }

  bind(props) {
    const gl = this.gl

    gl.viewport(0, 0, props.width, props.height)
    gl.enable(gl.BLEND)
    gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
    gl.blendFunc(gl.ONE, gl.ONE)
  }

  draw(props) {
    const gl = this.gl

    gl.enable(gl.DEPTH_TEST)

    this.particles.draw(uniforms => {
      uniforms.brightness     = this.brightness
      uniforms.color1         = this.color1
      uniforms.color2         = this.color2
      uniforms.visibleQuality = this.visibleQuality
      uniforms.highlightColor = this.highlightColor

      if (this.visibleQuality) {
        uniforms.quality = this.stats.quality.bind(1)
      }

      uniforms.proj = props.proj
      uniforms.view = props.view
      uniforms.time = props.time
      uniforms.eye  = props.eye
    })
  }

  unbind(props) {
    const gl = this.gl

    gl.disable(gl.BLEND)
    gl.depthMask(true)
  }

  resetPositions() {
    this.particles.populate((u, v, data) => {
      data[0] = (Math.random() - 0.5) * 0.1
      data[1] = (Math.random() - 0.5) * 0.1
      data[2] = (Math.random() - 0.5) * 0.1
      data[3] = (Math.random() - 0.5) * 0.1
    })
  }
}

function bogusAges(gl, shape) {
  var data = new Float32Array(shape[0] * shape[1])

  for (var i = 0; i < data.length; i++) {
    var t = i / (data.length - 1)

    data[i] = t
  }

  return Texture(gl, ndarray(data, [shape[0], shape[1]]))
}

function bogusRandom(gl, shape) {
  var data = new Float32Array(shape[0] * shape[1])

  for (var i = 0; i < data.length; i++) {
    data[i] = Math.pow(Math.random(), 5)
  }

  return Texture(gl, ndarray(data, [shape[0], shape[1]]))
}

function bogusQuality(gl, shape) {
  var data = new Float32Array(shape[0] * shape[1])

  for (var i = 0; i < data.length; i++) {
    data[i] = Math.random() > 0.5
      ? 0
      : Math.random() > 0.5
      ? 2 : 1
  }

  return Texture(gl, ndarray(data, [shape[0], shape[1]]))
}

function createTexture(gl, data, shape) {
  return Texture(gl, ndarray(new Float32Array(data), [shape[0], shape[1]]))
}

function getMin(data) {
  var min = +Infinity
  var i = data.length
  while (i--) if (data[i] < min) min = data[i]
  return min
}

function getMax(data) {
  var max = -Infinity
  var i = data.length
  while (i--) if (data[i] > max) max = data[i]
  return max
}
