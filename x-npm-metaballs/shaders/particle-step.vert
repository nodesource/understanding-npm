precision mediump float;

attribute vec2 uv;
varying vec2 vuv;

void main() {
  vuv = uv * 0.5 + 0.5;
  gl_Position = vec4(uv, 1, 1);
}
