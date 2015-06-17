(function() { // for better uglification

try {
  var canvas  = document.body.appendChild(document.createElement('canvas'))
  var gl      = canvas.getContext('webgl') || canvas.getContext('webgl-experimental') || canvas.getContext('experimental-webgl')
  var percent = document.body.appendChild(document.createElement('div'))

  if (!gl) throw new Error('WebGL support is unavailable or disabled! :(')
  if (!gl.getExtension('OES_texture_float')) throw new Error('Missing extension: OES_texture_float')
} catch(e) {
  console.error(e.message)

  ga('_trackEvent', 'Error', 'Intro Page', e.message)

  // Tag openings in this script have been replaced with `~` to
  // avoid inline script/HTML handling issues.
  document.body.setAttribute('class', 'no-webgl')
  document.body.innerHTML += [
      "~div class='unpm-fail'>"
    , "~h1>Sadly, it looks like this visualisation won't work on this device~/h1>"
    , "~p>Try viewing the site on another browser or device. "
    , "We recommend using Chrome or Firefox on a laptop or desktop computer for the best possible experience.~/p>"
    , "~/div>"
  ].join('')
   .replace(/\~/g, String.fromCharCode(60))

  return
}

percent.setAttribute('class', 'progress-percent')
percent.innerHTML = '0%'

var vert = createShader(gl.VERTEX_SHADER, `
precision mediump float;
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 1, 1);
}
`)
var frag = createShader(gl.FRAGMENT_SHADER, `
precision mediump float;
uniform float iGlobalTime;
uniform vec2  iResolution;

#define PI 3.14159265359

float map(vec2 p, float t, float channel) {
  float g = pow(sin(t * 1.25) * .5 + .5, 4.0);
  p.x += smoothstep(0.15, 1.0, g) * channel * 0.05;
  p.y += smoothstep(0.15, 1.0, g) * channel * 0.05;

  float radius = 0.03125;
  float d      = 9999.99;
  float sharp  = mix(80.0, 12.0, g);

  for (int i = 0; i < 10; i++) {
    float I = float(i);
    float a = PI * 0.2 * I + t;
    vec2  o = vec2(sin(a), cos(a)) * (0.25 + 0.06125 * (sin(a * 5.0) + 1.0));
    float circle = length(p + o) - radius;
    d = min(d, circle);
  }

  return pow(1.0 - d, sharp);
}

void main() {
  vec2 uv  = 2. * gl_FragCoord.xy / iResolution - 1.;
  vec3 col = vec3(0.0);

  for (int i = 0; i < 3; i++) {
    col[i] = map(uv, iGlobalTime, float(i) - 1.0);
  }

  col += vec3(0.12941,0.07058,0.18431);

  gl_FragColor = vec4(col, 1);
}
`)

var prog = gl.createProgram()

function createShader(type, src) {
  var shader = gl.createShader(type)

  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
  }

  return shader
}

gl.attachShader(prog, vert)
gl.attachShader(prog, frag)
gl.bindAttribLocation(prog, 0, 'position')
gl.linkProgram(prog)

if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(prog))
}

gl.useProgram(prog)
gl.disable(gl.DEPTH_TEST)
gl.disable(gl.CULL_FACE)

var iResolution = gl.getUniformLocation(prog, 'iResolution')
var iGlobalTime = gl.getUniformLocation(prog, 'iGlobalTime')

var start  = Date.now()
var buffer = gl.createBuffer()
var bdata  = new Float32Array([-1, -1, -1, 4, 4, -1])
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, bdata, gl.DYNAMIC_DRAW)
gl.enableVertexAttribArray(0)
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

render()
function render() {
  if (!gl) return

  var width  = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight
  var time   = (Date.now() - start) / 1000

  gl.viewport(0, 0, width, height)
  gl.uniform2f(iResolution, width, height)
  gl.uniform1f(iGlobalTime, time)
  gl.drawArrays(gl.TRIANGLES, 0, 3)

  requestAnimationFrame(render)
}

document.body.style.background = '#21122F'
canvas.width = 256
canvas.height = 256
canvas.style.position = 'absolute'
canvas.style.left = '50%'
canvas.style.top = '50%'
canvas.style.transform = 'translate(-50%, -50%) scale(0.5)'
canvas.style.transition = 'opacity 0.5s'
canvas.style.opacity = 1

window.addEventListener('unpm:progress', function(e) {
  percent.innerHTML = Math.round(100*e.count/e.total) + '%'
}, false)

window.addEventListener('unpm:ready', function(e) {
  canvas.style.opacity  = 0
  percent.style.opacity = 0
  setTimeout(function() {
    canvas.parentNode.removeChild(canvas)
    percent.parentNode.removeChild(percent)
    gl.deleteProgram(prog)
    gl.deleteShader(vert)
    gl.deleteShader(frag)
    gl.deleteBuffer(buffer)
    render = function(){}
    canvas = null
    gl = null
  }, 500)
})

setTimeout(function() {
  var script = document.createElement('script')
  var hash   = window.UNPM_BUNDLE_HASH || ''

  if (hash) hash += '.'

  script.setAttribute('charset', 'utf-8')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', 'bundle.' + hash + 'js')

  document.body.appendChild(script)
})

})()
