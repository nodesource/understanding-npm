precision mediump float;

uniform sampler2D data;
uniform sampler2D metric1;
uniform float time;
uniform vec2 resolution;
uniform float radius;
uniform float qualityThreshold;

#pragma glslify: noise = require('glsl-noise/simplex/4d')

void main() {
  vec2 uv       = gl_FragCoord.xy / resolution;
  vec4 tdata    = texture2D(data, uv);
  bool passing  = texture2D(metric1, uv).r >= qualityThreshold;
  vec3 position = tdata.xyz;

  if (passing) {
    position = mix(position, normalize(position) * radius, 0.015);
  } else {
    position.x += noise(vec4(position * 0.25, 230.5324 + uv.x + time * 0.25)) * 0.02;
    position.y += noise(vec4(position * 0.25, 930.5324 + uv.y + time * 0.25)) * 0.02;
    position.z += noise(vec4(position * 0.25, 820.5324 - uv.x + time * 0.25)) * 0.02;
    position *= 1.0015;
  }

  gl_FragColor = vec4(position, 1);
}
