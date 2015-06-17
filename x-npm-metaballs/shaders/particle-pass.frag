precision mediump float;

uniform vec2 dims;
varying vec2 vuv;
uniform sampler2D map;

void main() {
  float amp = texture2D(map, vuv).r;
  // gl_FragColor.rgb = vec3(amp);
  gl_FragColor.rgb = mix(vec3(1.0), vec3(0.0), (amp - 0.95) * 50.0);
  gl_FragColor.a = 1.0;
}
