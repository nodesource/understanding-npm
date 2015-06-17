#pragma glslify: frame = require('glsl-square-frame')
#pragma glslify: random = require('glsl-random')

vec4 background(vec2 iResolution, float iGlobalTime) {
  vec2 uv = frame(iResolution, gl_FragCoord.xy);

  float grad = dot(uv, uv * 0.25);

  grad *= sin(uv.x * 1.2 + iGlobalTime);
  grad *= cos(uv.y * 0.85 + iGlobalTime);
  grad += random(uv + iGlobalTime) * 0.08;

  grad = grad * 0.5 + 0.5;

  vec3 col1 = vec3(0.05296948480730148, 0.03586927601097223, 0.12350080907344818);
  vec3 col2 = vec3(0.07296948480730148, 0.03586927601097223, 0.08350080907344818) * 3.0;
  vec3 col  = mix(col1, col2, clamp(grad, 0.0, 1.0));

  return vec4(col, 1);
}

#pragma glslify: export(background)
