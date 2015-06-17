precision mediump float;

uniform vec2 iResolution;
uniform float iGlobalTime;

#pragma glslify: background = require('./background')

void main() {
  gl_FragColor = background(iResolution, iGlobalTime);
}
