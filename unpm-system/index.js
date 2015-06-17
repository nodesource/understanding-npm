const assert = require('assert')

//
// Base class for each system.
//
module.exports = class System {
  constructor(gl) {
    assert(gl, 'System needs to be created with a WebGL context')

    this.gl      = gl
    this.canvas  = gl.canvas
    this.enabled = true
  }

  tick() {}
  bind() {}
  draw() {}
  unbind() {}
}
