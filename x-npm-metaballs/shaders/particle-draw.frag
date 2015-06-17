precision mediump float;

void main() {
  float d = 1.0 - length(gl_PointCoord.xy * 2.0 - 1.0);
  gl_FragColor = vec4(d * 0.05, 0, 0, 1);
}
