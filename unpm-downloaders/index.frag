precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying float vDist;

uniform vec3 background;
uniform float time;

#pragma glslify: fog = require('glsl-fog')

void main() {
  vec3  dir = normalize(-vPosition);
  float dif = max(0.0, dot(dir, vNormal));

  vec3  color = vColor * dif + 0.15;
  float fogDensity = fog(vDist, 0.045);

  color = mix(color, background, fogDensity);

  gl_FragColor = vec4(color, 1);
}
