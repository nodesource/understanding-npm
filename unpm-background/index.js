const translate = require('gl-mat4/translate')
const identity  = require('gl-mat4/identity')
const multiply  = require('gl-mat4/multiply')
const rotateX   = require('gl-mat4/rotateX')
const rotateY   = require('gl-mat4/rotateY')
const rotateZ   = require('gl-mat4/rotateZ')
const scale     = require('gl-mat4/scale')

const triangle  = require('a-big-triangle')
const wireframe = require('gl-wireframe')
const Geom      = require('gl-geometry')
const Shader    = require('gl-shader')
const Grid      = require('grid-mesh')
const glslify   = require('glslify')

module.exports = Background

function Background(gl) {
  const baseModel  = new Float32Array(16)
  const model      = new Float32Array(16)
  const position   = new Float32Array(3)
  const resolution = new Float32Array(2)
  const shader     = Shader(gl
    , glslify('./background.vert')
    , glslify('./background.frag')
  )

  const gridShader = Shader(gl
    , glslify('./grid.vert')
    , glslify('./grid.frag')
  )

  const gridData = to3d(Grid(100, 100))
  const grid     = Geom(gl)
    .attr('position', gridData.positions)
    .faces(wireframe(gridData.cells))

  identity(baseModel)
  translate(baseModel, baseModel, [0, -6, 0])
  rotateX(baseModel, baseModel, Math.PI * 0.5)
  translate(baseModel, baseModel, [-50, -50, 0])
  scale(baseModel, baseModel, [1, 1, 1])

  render.position = position
  render.rotation = 0
  render.enabled  = true

  return render

  function render(props) {
    resolution[0] = props.width
    resolution[1] = props.height

    shader.bind()
    shader.uniforms.iResolution = resolution
    shader.uniforms.iGlobalTime = props.time

    gl.disable(gl.CULL_FACE)
    gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
    triangle(gl)
    gl.depthMask(true)

    identity(model)
    rotateY(model, model, render.rotation)
    multiply(model, model, baseModel)
    translate(model, model, render.position)


    gl.lineWidth(1)
    gl.enable(gl.BLEND)
    gl.enable(gl.DEPTH_TEST)
    gl.blendFunc(gl.ONE, gl.ONE)
    grid.bind(gridShader)
    gridShader.uniforms.iResolution = resolution
    gridShader.uniforms.time        = props.time
    gridShader.uniforms.proj        = props.proj
    gridShader.uniforms.view        = props.view
    gridShader.uniforms.eye         = props.eye
    gridShader.uniforms.model       = model
    grid.draw(gl.LINES)
    gl.disable(gl.BLEND)
  }
}

function to3d(simplex) {
  var p = simplex.positions

  for (var i = 0; i < p.length; i++) {
    p[i][2] = 0
  }

  return simplex
}
