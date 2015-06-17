var css      = require('defaultcss')
var inherits = require('inherits')
var Slider   = require('./slider')
var Emitter  = require('events/')
var zfill    = require('zfill')
var path     = require('path')
var fs       = require('fs')

module.exports = GooeyRGB

inherits(GooeyRGB, Emitter)
function GooeyRGB(value, min, max) {
  if (!(this instanceof GooeyRGB))
    return new GooeyRGB(value, min, max)

  Emitter.call(this)

  var sliders = this.sliders = []
  for (var i = 0; i < value.length; i++) {
    sliders[i] = Slider(value[i], min, max)
  }

  var self = this

  self.value = value
  self.el = document.createElement('div')
  self.el.classList.add('gooey-vector')
  self._setting = false

  sliders.forEach(function(channel, i) {
    self.el.appendChild(channel.el)

    channel.on('change', function() {
      if (self._setting) return
      self.value[i] = channel.value
      self.emit('change')
    })
  })

  this.set(value)
}

GooeyRGB.prototype.set = function(value) {
  this._setting = true
  this.value = value

  for (var i = 0; i < value.length; i++) {
    this.sliders[i].set(value[i])
  }

  this._setting = false
  this.emit('change')
}
