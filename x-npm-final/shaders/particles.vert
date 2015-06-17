precision mediump float;

uniform sampler2D data;
uniform mat4 proj;
uniform mat4 view;
uniform vec3 eye;

varying vec3 vpos;
varying vec3 epos;

attribute vec2 uv;

void main() {
  vec4 tdata = texture2D(data, uv);
  vec3 position = tdata.xyz;

  vpos = position;
  epos = position - eye;
  gl_PointSize = max(2.0, (96.0 + uv.y * 24.0) / length(eye - position));
  gl_Position = proj * view * vec4(position, 1);
}
