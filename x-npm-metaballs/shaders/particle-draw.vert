precision mediump float;

uniform sampler2D map;
uniform vec2 dims;
attribute vec2 uv;

void main() {
  vec2 position = texture2D(map, uv).xy;

  gl_PointSize = 16.0;
  gl_Position = vec4(position.x / dims.y * dims.x, position.y, 1, 1);
}
