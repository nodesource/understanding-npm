var escape   = require('escape-html')
var css      = require('defaultcss')
var inherits = require('inherits')
var Emitter  = require('events/')
var path     = require('path')
var fs       = require('fs')

css('gooey', fs.readFileSync(
  path.join(__dirname, 'index.css')
, 'utf8'))

module.exports = Gooey

inherits(Gooey, Emitter)
function Gooey() {
  if (!(this instanceof Gooey)) return new Gooey
  Emitter.call(this)

  var self = this

  this.visible = false

  this.toggleButton = document.createElement('div')
  this.toggleButton.classList.add('gooey-top-toggle')
  this.toggleButton.addEventListener('click', function() {
    self.toggle()
  }, false)

  this.el = document.createElement('div')
  this.el.classList.add('gooey')
  this.el.appendChild(this.toggleButton)
  this.values   = {}
  this.elements = {}
}

Gooey.prototype.attach = function() {
  document.body.appendChild(this.el)
  return this
}

Gooey.prototype.add = function(name, node) {
  var wrap = document.createElement('div')
  var head = document.createElement('h1')
  var self = this

  head.innerHTML = escape(name)
  head.classList.add('gooey-h1')
  wrap.classList.add('gooey-entry')

  this.el.appendChild(wrap)
  wrap.appendChild(head)
  wrap.appendChild(node.el)

  self.elements[name] = node
  self.values[name]   = node.value
  node.on('change', function() {
    self.emit(name, self.values[name] = node.value)
  })

  return this
}

Gooey.prototype.toggle = function() {
  if (this.visible) {
    this.hide()
  } else {
    this.show()
  }
}
Gooey.prototype.hide = function() {
  this.visible = false
  this.el.classList.remove('gooey-visible')
}
Gooey.prototype.show = function() {
  this.visible = true
  this.el.classList.add('gooey-visible')
}
