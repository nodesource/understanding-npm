precision mediump float;

#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
#pragma glslify: fog   = require('glsl-fog')

varying vec3 normal;
uniform vec3 color;
uniform vec3 eye;

void main() {
  vec3  vdr = normalize(eye - normal);
  vec3  dir = normalize(vec3(0, 1, 0.9));
  float dif = orenn(dir, vdr, normal, 0.5, 1.0);
  float rim = max(0.0, dot(normal, -vdr) + 0.5);
  vec3  col = vec3(color) * 1.5;
  vec3  amb = col * 0.3;

  vec3 lig = amb + col * (rim + dif);

  gl_FragColor = vec4(lig * (1.0 - fog(length(eye - normal), 0.075)), 1);
}
