var mouse    = require('mouse-position')
var perFrame = require('frame-debounce')
var css      = require('defaultcss')
var inherits = require('inherits')
var Emitter  = require('events/')
var clamp    = require('clamp')
var path     = require('path')
var fs       = require('fs')

css('gooey-toggle', fs.readFileSync(
  path.join(__dirname, 'toggle.css')
, 'utf8'))

module.exports = GooeyToggle

inherits(GooeyToggle, Emitter)
function GooeyToggle(value) {
  if (!(this instanceof GooeyToggle))
    return new GooeyToggle(value)

  var self = this

  Emitter.call(this)
  this.value = value = !!value

  this.el = document.createElement('div')
  this.el.classList.add('gooey-toggle')

  this.input = document.createElement('input')
  this.input.setAttribute('type', 'checkbox')
  this.el.appendChild(this.input)

  this.input.addEventListener('change', function() {
    self.set(!!self.input.checked)
  }, false)

  this.set(value)
}

GooeyToggle.prototype.set = function(value) {
  this.input.checked = this.value = !!value
  this.emit('change', this.value)
}
