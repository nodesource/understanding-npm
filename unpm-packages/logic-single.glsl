precision mediump float;

uniform sampler2D data;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv       = gl_FragCoord.xy / resolution;
  vec4 tdata    = texture2D(data, uv);
  vec3 position = tdata.xyz;

  if (gl_FragCoord.x <= 1.0 && gl_FragCoord.y <= 1.0) {
    position = mix(position, vec3(3.0, 0, 0), 0.05);
  } else {
    position *= 0.95;
  }

  gl_FragColor = vec4(position, 1);
}
