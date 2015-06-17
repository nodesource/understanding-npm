precision mediump float;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying float vDist;

uniform mat3 normalMat;
uniform mat4 proj;
uniform mat4 view;
uniform mat4 model;
uniform vec3 eye;

uniform vec3  color1;
uniform vec3  color2;
uniform float brightness;
uniform vec3  background;
varying vec3  lightColor;

#pragma glslify: colorMix = require('@unpm/packages/color-mix')

void main() {
  vNormal = normalize(normalMat * normal);
  vPosition = (model * vec4(position, 1)).xyz;
  vColor = mix(
    color1 * brightness,
    color2 * brightness,
    colorMix(normalize(vPosition))
  );

  vDist = length(eye - vPosition);

  gl_Position = proj * view * model * vec4(position, 1);
}
