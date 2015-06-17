precision mediump float;

uniform sampler2D data;
uniform float time;
uniform vec2 resolution;
uniform float radius;

uniform sampler2D metric1;

#pragma glslify: noise = require('glsl-noise/simplex/4d')

void main() {
  vec2 uv       = gl_FragCoord.xy / resolution;
  vec4 tdata    = texture2D(data, uv);
  float adata   = texture2D(metric1, uv).r;
  vec3 position = tdata.xyz;

  if (time > adata * 15.0) {
    float a = mix(0.0475, 0.0575, clamp(time * 0.02, 0.0, 1.0));
    float u = 0.05 + clamp(time * 8.5, 0.0, 5.0);
    float c = mix(0.0, 0.045, clamp(time * 0.25 - 2.0, 0.0, 1.0)); // clamp(time * 0.0005 - 0.5, 0.0, 0.02);

    position = mix(position, normalize(position) * radius, c);
    position.x += noise(vec4(position * 0.4, 230.5324 + uv.x * u + time * 0.05)) * a;
    position.y += noise(vec4(position * 0.4, 930.5324 + uv.y * u + time * 0.05)) * a;
    position.z += noise(vec4(position * 0.4, 820.5324 - uv.x * u + time * 0.05)) * a;
  }

  gl_FragColor = vec4(position, 1);
}
