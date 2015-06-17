precision mediump float;

uniform vec3 color1;
uniform vec3 color2;
uniform float brightness;

varying vec3 vpos;
varying vec3 epos;
varying vec3 color;

void main() {
  float d = 1.0 - length(gl_PointCoord.xy * 2.0 - 1.0);
  float k = clamp(length(vpos) - 1.0, 0.0, 1.0);

  d += 0.05;
  d = 1.0 - pow(1.0 - d, max(0.0, 0.125 + max(1.0 - length(vpos - epos) * 0.25, -1.0) * 0.0625));

  gl_FragColor = vec4(color * d * k, 1);
}
