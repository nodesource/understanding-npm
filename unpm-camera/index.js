const perspective = require('gl-mat4/perspective')
const multiply    = require('gl-mat4/multiply')
const Camera      = require('lookat-camera')
const eye         = require('eye-vector')

module.exports = () => new SuperCamera

class SuperCamera extends Camera {
  constructor() {
    super()
  }

  view(props) {
    super.view(props.view)
    perspective(props.proj
      , props.fov
      , props.width / props.height
      , props.near
      , props.far
    )

    eye(props.view, props.eye)

    multiply(props.mvp, props.proj, props.view)
    multiply(props.mvp, props.mvp, props.model)
  }
}
