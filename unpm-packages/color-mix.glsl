#pragma glslify: noise = require('glsl-noise/simplex/4d')

float colorMix(vec3 position) {
  float n = noise(vec4(position, 0.53290)) * 0.5 + 0.5;
  float m = normalize(position).y * 0.5 + 0.5;

  return mix(n, m, 0.5);
}

#pragma glslify: export(colorMix)
