const canvas     = document.getElementById('viewer').appendChild(document.createElement('canvas'))
const editorEl   = document.getElementById('editor')

const Geom       = require('gl-geometry')
const CodeMirror = require('codemirror')
const Context    = require('gl-context')
const Shader     = require('gl-shader')
const fs         = require('fs')

const vert = fs.readFileSync(__dirname + '/index.vert', 'utf8')
const frag = fs.readFileSync(__dirname + '/index.frag', 'utf8')

const editor     = CodeMirror(editorEl)
const gl         = Context(canvas, render)
const pShader    = Shader(gl, vert, frag)
const pGeom      = Geom(gl).attr('position', [[0, 0, 0]])
const qGeom      = Geom(gl).attr('position', genPositions())

editor.setValue(frag)
editor.on('change', function() {
  pShader.update(vert, editor.getValue())
})

function render() {
  const width  = gl.drawingBufferWidth
  const height = gl.drawingBufferHeight / 2

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE)
  gl.viewport(0, height, width, height)

  pGeom.bind(pShader)
  pShader.uniforms.size = Math.min(width, height) * 0.8
  pGeom.draw(gl.POINTS)

  gl.viewport(0, 0, width, height)
  qGeom.bind(pShader)
  pShader.uniforms.size = 16
  qGeom.draw(gl.POINTS)
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)

function genPositions() {
  var p = []

  for (var i = 0; i < 350; i++) {
    p.push([Math.random() - 0.5, Math.random() - 0.5, 0])
  }

  return p
}
