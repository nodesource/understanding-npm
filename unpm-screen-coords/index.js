const project = require('from-3d-to-2d')

module.exports = screenCoords

function screenCoords(worldSpace, props, output) {
  output = output || []

  project(output, worldSpace, props.mvp)

  output[0] *= props.width
  output[1] *= props.height

  return output
}
