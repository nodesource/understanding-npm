precision mediump float;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 model;

attribute vec3 position;
varying vec3 normal;

void main() {
  normal = normalize(position);
  gl_Position = proj * view * model * vec4(position, 1);
}
