precision mediump float;

attribute vec3 position;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 model;
uniform vec3 eye;
uniform float time;

varying float vDist;
varying vec3  vPosition;

void main() {
  vec3 pos = position
    + sin(time + position.x * 0.1) * vec3(0, 0, 0.35)
    + cos(time + position.y * 0.7) * vec3(0, 0, 0.1);

  vPosition = (model * vec4(pos, 1)).xyz;
  vDist = length(eye - vPosition);

  gl_Position = proj * view * model * vec4(pos, 1);
}
