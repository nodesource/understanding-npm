precision mediump float;

void main() {
  vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
  float d = 1.0 - length(uv);

  gl_FragColor = vec4(d, d, d, 1);
}
