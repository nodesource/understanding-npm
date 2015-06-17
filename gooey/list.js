var mouse    = require('mouse-position')
var perFrame = require('frame-debounce')
var css      = require('defaultcss')
var inherits = require('inherits')
var Emitter  = require('events/')
var clamp    = require('clamp')
var path     = require('path')
var fs       = require('fs')

css('gooey-list', fs.readFileSync(
  path.join(__dirname, 'list.css')
, 'utf8'))

module.exports = GooeyList

inherits(GooeyList, Emitter)
function GooeyList(value, items) {
  if (!(this instanceof GooeyList))
    return new GooeyList(value, items)

  var self = this

  Emitter.call(this)
  this.value = value
  this.items = items

  this.dropdown = document.createElement('select')

  this.el = document.createElement('div')
  this.el.classList.add('gooey-list')
  this.el.appendChild(this.dropdown)

  Object.keys(items).forEach(function(key) {
    var opt = document.createElement('option')
    var val = items[key]

    opt.value = key
    opt.innerHTML = key

    if (val === value) opt.setAttribute('selected', '')
    self.dropdown.appendChild(opt)
  })

  this.dropdown.addEventListener('change', function() {
    var old = self.value

    self.set(items[self.dropdown.value])

    if (self.value !== old) {
      self.emit('change')
    }
  }, false)

  this.set(value)
}

GooeyList.prototype.set = function(value) {
  this.value = value

  if (this.selectByValue(value)) {
    this.emit('change')
  }
}

GooeyList.prototype.selectByValue = function(value) {
  var keys    = Object.keys(this.items)
  var matches = keys.filter(function(key) {
    return this.items[key] === value
  }, this)

  if (!matches.length) return

  var index  = keys.indexOf(matches[0])
  var change = this.dropdown.selectedIndex !== index
  if (change) {
    this.dropdown.selectedIndex = index
  }

  return change
}
