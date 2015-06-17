precision mediump float;

attribute vec4 position;

uniform mat4 proj;
uniform mat4 view;
uniform sampler2D pdata;
uniform float time;
uniform float rate;
uniform float count;

varying float progress;
varying float amplitude;
uniform float strength;

#define PI  3.14159265359
#define TAU 6.28318530718

void main() {
  vec2 uv = vec2(
    0.5 + sin(time * 0.15 - position.w * 1.0) * 0.5,
    0.5 + cos(time * 0.15 + position.w * 1.0) * 0.5
  );

  vec3 pos1 = position.xyz;
  vec3 pos2 = texture2D(pdata, uv).xyz;
  float b   = fract(position.w) * 2.0;

  progress = b;
  amplitude = sin(rate * time * TAU / count + position.w * 1.8) > -0.25 ? strength : 0.0;

  gl_Position = proj * view * vec4(mix(pos1, pos2, b), 1);
}
