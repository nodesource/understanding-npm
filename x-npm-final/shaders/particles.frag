precision mediump float;

varying vec3 vpos;
varying vec3 epos;

#pragma glslify: noise = require('glsl-noise/simplex/4d')
#pragma glslify: fog   = require('glsl-fog')

void main() {
  float d = 1.0 - length(gl_PointCoord.xy * 2.0 - 1.0);
  float k = clamp(length(vpos) - 1.0, 0.0, 1.0);
  float n = noise(vec4(vpos, 0.53290)) * 0.5 + 0.5;
  float m = normalize(vpos).y * 0.5 + 0.5;

  vec3 c = mix(
    vec3(1.15, 0.45, 0.25) * 2.0,
    vec3(0.15, 0.25, 0.65) * 3.0,
    (m + n) * 0.5
  );

  k = k * (1.0 - fog(length(epos), 0.075));
  d = pow(d, 8.0);
  gl_FragColor = vec4(k * c * d, 1);
}
