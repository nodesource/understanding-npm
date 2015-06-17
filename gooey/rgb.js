var css      = require('defaultcss')
var inherits = require('inherits')
var Vector   = require('./vector')
var Emitter  = require('events/')
var zfill    = require('zfill')
var path     = require('path')
var fs       = require('fs')

module.exports = GooeyRGB

css('gooey-rgb', fs.readFileSync(
  path.join(__dirname, 'rgb.css')
, 'utf8'))

inherits(GooeyRGB, Emitter)
function GooeyRGB(value, min, max) {
  if (!(this instanceof GooeyRGB))
    return new GooeyRGB(value, min, max)

  this.vector = Vector(value, min, max)

  var r = this.r = this.vector.sliders[0]
  var g = this.g = this.vector.sliders[1]
  var b = this.b = this.vector.sliders[2]
  var rgb  = this.rgb = [r, g, b]
  var self = this

  self.value = value
  self.el = document.createElement('div')
  self.el.classList.add('gooey-rgb')
  self._setting = false

  r.el.classList.add('gooey-rgb-r')
  g.el.classList.add('gooey-rgb-g')
  b.el.classList.add('gooey-rgb-b')

  var display = document.createElement('div')
  display.classList.add('gooey-rgb-display')
  self.el.appendChild(display)

  this.vector.on('change', function() {
    self.emit('change')
  })

  rgb.forEach(function(channel, i) {
    self.el.appendChild(channel.el)
  })

  this.on('change', function() {
    var hex = [0, 0, 0]

    // Convert the [1, 1, 1] color to CSS hex value
    hex[0] = zfill(Math.round(self.value[0] * 255).toString(16), 2)
    hex[1] = zfill(Math.round(self.value[1] * 255).toString(16), 2)
    hex[2] = zfill(Math.round(self.value[2] * 255).toString(16), 2)

    display.style.background = '#' + hex.join('')
  })

  this.set(value)
}

GooeyRGB.prototype.set = function(value) {
  this.vector.set(value)
}
