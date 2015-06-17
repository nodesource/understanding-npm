precision mediump float;

varying float vDist;

uniform vec2 iResolution;
uniform vec3 eye;
uniform float time;

#pragma glslify: background = require('./background')
#pragma glslify: fog        = require('glsl-fog')

void main() {
  vec3 color = vec3(0.0); // background(iResolution, time).rgb;
  vec3 line  = vec3(1.2, 0.5, 0.8);

  float fogDensity = fog(vDist, 0.07);

  color = mix(line, color, fogDensity);

  gl_FragColor = vec4(color, 1);
}
