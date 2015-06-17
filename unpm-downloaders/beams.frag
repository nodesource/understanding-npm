precision mediump float;

varying float progress;
varying float amplitude;

uniform float time;

#define PI 3.14159265359

void main() {
  float brightness = mix(sin(PI * 0.5 + progress * PI * 2.0) * 0.5 + 0.5, 0.5, 1.0);

  gl_FragColor = vec4(amplitude * vec3(0.8, 0.6, 1.0) * brightness, 1.0);
}
