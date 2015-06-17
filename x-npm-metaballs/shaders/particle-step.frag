precision mediump float;

varying vec2 vuv;
uniform vec2 dims;
uniform sampler2D map;
uniform float time;

#pragma glslify: curl = require('./curl')

void main() {
  vec2 position = texture2D(map, vuv).xy;
  vec2 fc = gl_FragCoord.xy;

  position += 0.005 * curl(vec3(position.xy, time + fc.x / 110.0) + vec3(25.034219803820981342)).xy;
  position += 0.005 * curl(vec3(position.yx, time - fc.y / 110.0) + vec3(39.328943289248394)).zx;
  position *= mix(1.001, 0.975, length(position));

  position += (vec2(
    vuv.x * sin(vuv.y * 3.14159265359 * 2.),
    vuv.x * cos(vuv.y * 3.14159265359 * 2.)
  ) - position) * clamp(2.0 - time * 0.1, 0.0, 1.0);

  gl_FragColor.xy = position;
  gl_FragColor.zw = vec2(1.0);
}
