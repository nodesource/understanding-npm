precision mediump float;

uniform sampler2D data;
uniform sampler2D metric1;
uniform sampler2D metric2;
uniform vec4 metricScale;
uniform float time;
uniform vec2 resolution;
uniform bool isLog;

#pragma glslify: noise    = require('glsl-noise/simplex/4d')
#pragma glslify: scaleLin = require('glsl-scale-linear')
#pragma glslify: scaleLog = require('glsl-scale-log')

void main() {
  vec2 uv       = gl_FragCoord.xy / resolution;
  vec4 tdata    = texture2D(data, uv);
  vec3 position = tdata.xyz;

  float m1 = texture2D(metric1, uv).r;
  float m2 = texture2D(metric2, uv).r;

  vec2 scl = isLog
    ? vec2(scaleLin(m1, metricScale.xy), scaleLog(10.0, m2, metricScale.zw))
    : vec2(scaleLin(m1, metricScale.xy), scaleLin(m2, metricScale.zw));

  vec3 tar = vec3(
    1.0 - scl.x * 2.0,
    scl.y * 2.0 - 1.0,
    3.0
  ) * vec3(3, 3, 1);

  if (time > uv.x * 0.85) {
    position = mix(position, tar, 0.095);
  } else {
    position.x += noise(vec4(position * 0.25, 230.5324 + uv.x + time * 0.25)) * 0.035;
    position.y += noise(vec4(position * 0.25, 930.5324 + uv.y + time * 0.25)) * 0.035;
    position.z += noise(vec4(position * 0.25, 820.5324 - uv.x + time * 0.25)) * 0.035;
  }

  gl_FragColor = vec4(position, 1);
}
