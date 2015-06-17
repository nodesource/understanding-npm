precision mediump float;

attribute vec2 position;
varying vec2 vuv;

void main() {
  vuv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 1, 1);
}
