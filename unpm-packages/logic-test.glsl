precision mediump float;

uniform sampler2D data;
uniform float time;
uniform vec2 resolution;
uniform float radius;

#pragma glslify: noise = require('glsl-noise/simplex/4d')

void main() {
  vec2 uv       = gl_FragCoord.xy / resolution;
  vec4 tdata    = texture2D(data, uv);
  vec3 position = tdata.xyz;

  position = mix(position, normalize(position) * radius, 0.015);
  position.x += noise(vec4(position * 8.5, 230.5324 + uv.x + time * 0.25)) * 0.0045;
  position.y += noise(vec4(position * 8.5, 930.5324 + uv.y + time * 0.25)) * 0.0045;
  position.z += noise(vec4(position * 8.5, 820.5324 - uv.x + time * 0.25)) * 0.0045;

  gl_FragColor = vec4(position, 1);
}
