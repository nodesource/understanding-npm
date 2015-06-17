var css      = require('defaultcss')
var color    = require('onecolor')
var inherits = require('inherits')
var Vector   = require('./vector')
var Emitter  = require('events/')
var zfill    = require('zfill')
var path     = require('path')
var fs       = require('fs')

module.exports = GooeyHSV

css('gooey-hsv', fs.readFileSync(
  path.join(__dirname, 'hsv.css')
, 'utf8'))

inherits(GooeyHSV, Emitter)
function GooeyHSV(value, min, max) {
  if (!(this instanceof GooeyHSV))
    return new GooeyHSV(value, min, max)

  this.vector = Vector(new Float32Array(3), min, max)

  var c = color(['RGB', value[0], value[1], value[2]])

  var h = this.h = this.vector.sliders[0]
  var s = this.s = this.vector.sliders[1]
  var v = this.v = this.vector.sliders[2]
  var hsv  = this.hsv = [h, s, v]
  var self = this

  self.value = value
  self.el = document.createElement('div')
  self.el.classList.add('gooey-hsv')
  self._setting = false

  h.el.classList.add('gooey-hsv-h')
  s.el.classList.add('gooey-hsv-s')
  v.el.classList.add('gooey-hsv-v')

  var display = document.createElement('div')
  display.classList.add('gooey-hsv-display')
  self.el.appendChild(display)

  hsv.forEach(function(channel, i) {
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

  h.set(c.hue())
  s.set(c.saturation())
  v.set(c.value())
  this.emit('change')

  this.vector.on('change', function() {
    self.set(self.vector.value)
  })
}

GooeyHSV.prototype.set = function(hsvValue) {
  var rgb = color(['HSV', hsvValue[0], hsvValue[1], hsvValue[2]])

  this.value[0] = rgb.red()
  this.value[1] = rgb.green()
  this.value[2] = rgb.blue()

  this.emit('change')
}
