precision mediump float;

attribute vec3 position;
uniform float size;

void main() {
  gl_PointSize = size;
  gl_Position = vec4(position, 1);
}
