precision mediump float;

uniform sampler2D data;
uniform mat4 proj;
uniform mat4 view;
uniform vec3 eye;

uniform vec3 color1;
uniform vec3 color2;
uniform float brightness;
uniform vec3 highlightColor;

varying vec3 color;
varying vec3 vpos;
varying vec3 epos;

uniform float visibleQuality;
uniform sampler2D quality;

attribute vec2 uv;

#pragma glslify: colorMix = require('./color-mix')

void main() {
  vec4 tdata = texture2D(data, uv);
  vec4 qdata = texture2D(quality, uv);
  vec3 position = tdata.xyz;

  vpos = position;
  epos = position - eye;

  color = mix(
    color1 * brightness,
    color2 * brightness,
    colorMix(vpos)
  );

  float qualityHighlight = visibleQuality <= 0.0
    ? 1.0
    : clamp(qdata.r - visibleQuality, 0.0, 1.0);

  color = mix(highlightColor * brightness, color, qualityHighlight);

  float size = (96.0 + uv.y * 24.0) / length(eye - position);
  gl_PointSize = max(2.0, size);
  gl_Position = proj * view * vec4(position, 1);
}
