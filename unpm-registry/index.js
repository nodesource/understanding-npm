const mat4Identity = require('gl-mat4/identity')
const mat4Create   = require('gl-mat4/create')
const mat4Scale    = require('gl-mat4/scale')
const System       = require('@unpm/system')
const Geom         = require('gl-geometry')
const Shader       = require('gl-shader')
const icosphere    = require('icosphere')
const glslify      = require('glslify')

module.exports = gl => new Registry(gl)

class Registry extends System {
  constructor(gl) {
    super(gl)

    this.model  = mat4Create()
    this.shader = Shader(gl
      , glslify('./shader.vert')
      , glslify('./shader.frag')
    )

    this.geom = Geom(gl)
    this.geom.attr('position', icosphere(3))
    this.scale = [1, 1, 1]

    this.color = new Float32Array([0.9, 0.55, 1.4])
  }

  tick(props) {
    mat4Identity(this.model)
    mat4Scale(this.model, this.model, this.scale)
  }

  bind(props) {
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthMask(true)
    this.geom.bind(this.shader)
    this.shader.uniforms.view  = props.view
    this.shader.uniforms.proj  = props.proj
    this.shader.uniforms.eye   = props.eye
  }

  draw(props, model) {
    this.shader.uniforms.color = this.color
    this.shader.uniforms.model = this.model
    this.geom.draw()
  }

  unbind(props) {

  }
}
