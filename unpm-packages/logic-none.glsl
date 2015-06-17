precision mediump float;

uniform sampler2D data;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv       = gl_FragCoord.xy / resolution;
  vec4 tdata    = texture2D(data, uv);
  vec3 position = tdata.xyz;

  gl_FragColor = vec4(position, 1);
}
