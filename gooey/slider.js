var mouse    = require('mouse-position')
var perFrame = require('frame-debounce')
var css      = require('defaultcss')
var inherits = require('inherits')
var Emitter  = require('events/')
var clamp    = require('clamp')
var path     = require('path')
var fs       = require('fs')

css('gooey-slider', fs.readFileSync(
  path.join(__dirname, 'slider.css')
, 'utf8'))

module.exports = GooeySlider

inherits(GooeySlider, Emitter)
function GooeySlider(value, min, max) {
  if (!(this instanceof GooeySlider))
    return new GooeySlider(value, min, max)

  var self = this

  Emitter.call(this)
  this.value = value
  this.min   = min
  this.max   = max

  this.el = document.createElement('div')
  this.el.classList.add('gooey-slider')

  this.wrap = this.el.appendChild(document.createElement('div'))
  this.wrap.classList.add('gooey-slider-wrap')

  this.inner = this.wrap.appendChild(document.createElement('div'))
  this.inner.classList.add('gooey-slider-inner')

  var dragging = false
  var width    = 0

  this.wrap.addEventListener('mousedown', function(e) {
    dragging = true
    width = self.wrap.getBoundingClientRect().width
  }, false)

  window.addEventListener('mouseup', function(e) {
    dragging = false
  }, false)

  var m = mouse(this.wrap, window).on('move', perFrame(function() {
    if (!dragging) return

    var progress = clamp(m.x / width, 0, 1)
    var value = self.min + progress * (self.max - self.min)
    self.set(value)
  }))

  this.set(value)
}

GooeySlider.prototype.set = function(value) {
  this.value = clamp(value, this.min, this.max)
  this.emit('change')

  var progress = (value - this.min) / (this.max - this.min)
  var percent  = progress * 100

  this.inner.style.width = percent + '%'
}
