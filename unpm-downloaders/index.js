const normalMatrix  = require('gl-mat3/normal-from-mat4')
const transformMat4 = require('gl-vec3/transformMat4')
const translate     = require('gl-mat4/translate')
const identity      = require('gl-mat4/identity')
const rotateX       = require('gl-mat4/rotateX')
const rotateY       = require('gl-mat4/rotateY')
const rotateZ       = require('gl-mat4/rotateZ')
const scale         = require('gl-mat4/scale')
const System        = require('@unpm/system')
const unindex       = require('unindex-mesh')
const normals       = require('face-normals')
const Geom          = require('gl-geometry')
const icosphere     = require('icosphere')
const Shader        = require('gl-shader')
const glBuffer      = require('gl-buffer')
const glslify       = require('glslify')
const glVAO         = require('gl-vao')
const dup           = require('dup')
const eases         = require('eases/back-out')

const scratch       = new Float32Array(16)
const zero          = new Float32Array(16)
const secondsInADay = 24 * 60 * 60
const TAU           = Math.PI * 2

module.exports = (gl, data) => new Downloaders(gl, data)

class Downloaders extends System {
  constructor(gl, data) {
    super(gl)

    this.startTime  = 0
    this.endTime    = 0
    this.entry      = 1
    this.exit       = 0
    this.size       = 0.175
    this.count      = 32
    this.radius     = 7
    this.beaming    = false
    this.rate       = data.dailyDownloads / secondsInADay / 5 * 32768 / 140000 // downloads/second
    this.models     = dup(this.count).map(_ => new Float32Array(16))
    this.normals    = dup(this.count).map(_ => new Float32Array(9))
    this.brightness = 1
    this.color1     = new Float32Array([1.00, 0.45, 0.25])
    this.color2     = new Float32Array([0.15, 0.25, 0.65])
    this.background = new Float32Array([0.05296948480730148, 0.03586927601097223, 0.12350080907344818])
    this.particles  = data.particles

    this.bufferData = new Float32Array(this.count * 4 * 2)
    this.buffer     = glBuffer(gl, this.bufferData)
    this.vao        = glVAO(gl, [{
      type: gl.FLOAT,
      size: 4,
      buffer: this.buffer
    }])

    this.shader = Shader(gl
      , glslify('./index.vert')
      , glslify('./index.frag')
    )

    this.beamShader = Shader(gl
      , glslify('./beams.vert')
      , glslify('./beams.frag')
    )

    this.beamShader.attributes.position.location = 0

    var mesh = icosphere(0)

    mesh = unindex(mesh.positions, mesh.cells)

    this.geom = Geom(gl)
      .attr('position', mesh)
      .attr('normal', normals(mesh))
  }

  tick(props) {
    for (var i = 0; i < this.count; i++) {
      var t = Math.min(Math.max(0, this.entry * 0.2 - i/this.count), 1)
      var s = this.size * Math.pow(eases(t), 4) * Math.max(0, 1 - this.exit)
      var g = 3 - eases(t) * 2
      var normal = this.normals[i]
      var model  = this.models[i]

      // Calculate the model matrix that rotates the downloaders
      // around the central package sphere
      identity(model)
      rotateY(model, model, 0.5 * this.entry + i)
      rotateX(model, model, TAU * i / this.count + this.entry)
      translate(model, model, [0, g * this.radius, 0])
      scale(model, model, [s, s, s])
      rotateY(model, model, props.time / 300)
      rotateZ(model, model, props.time / 545)

      // The normal matrix is determined from the model matrix, and
      // required for calculating lighting in world space after transforming
      // the downloaders' positions
      normalMatrix(normal, model)

      // Determine the worldspace positions of the downloaders. We feed this
      // into a buffer each frame so that we can draw the beams from each
      // downloader to their packages in a single draw call. Since we're
      // using gl.LINES, we have two copies of the same position for each
      // line. The fourth element is an index, so when vec.w == 1.0 we can
      // draw the vertex at the particle and when vec.w == 0.0 we can draw
      // it at the downloader.
      var j = i * 8

      transformMat4(scratch, zero, model)
      this.bufferData[j++] = scratch[0]
      this.bufferData[j++] = scratch[1]
      this.bufferData[j++] = scratch[2]
      this.bufferData[j++] = i
      this.bufferData[j++] = scratch[0]
      this.bufferData[j++] = scratch[1]
      this.bufferData[j++] = scratch[2]
      this.bufferData[j++] = i + 0.5
    }
  }

  bind(props) {
    this.geom.bind(this.shader)
    this.shader.uniforms.time       = props.time
    this.shader.uniforms.proj       = props.proj
    this.shader.uniforms.view       = props.view
    this.shader.uniforms.eye        = props.eye
    this.shader.uniforms.color1     = this.color1
    this.shader.uniforms.color2     = this.color2
    this.shader.uniforms.brightness = this.brightness
    this.shader.uniforms.background = this.background
  }

  draw(props) {
    const gl = this.gl

    for (var i = 0; i < this.count; i++) {
      this.shader.uniforms.model = this.models[i]
      this.shader.uniforms.normalMat = this.normals[i]
      this.geom.draw()
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.lineWidth(2)
    gl.depthMask(false)
    this.buffer.bind()
    this.buffer.update(this.bufferData)
    this.beamShader.bind()
    this.beamShader.uniforms.time  = props.time
    this.beamShader.uniforms.proj  = props.proj
    this.beamShader.uniforms.view  = props.view
    this.beamShader.uniforms.eye   = props.eye
    this.beamShader.uniforms.pdata = this.particles.prev.color[0].bind(0)
    this.beamShader.uniforms.rate  = this.rate
    this.beamShader.uniforms.count = this.count
    this.beamShader.uniforms.strength = (1 - this.exit) * this.beaming
    this.vao.bind()
    this.vao.draw(gl.LINES, this.count * 2)
    gl.depthMask(true)
    gl.disable(gl.BLEND)
  }

  unbind(props) {

  }
}
