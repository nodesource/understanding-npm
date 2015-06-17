const Set     = global.Set || require('es6-set')
const screen  = require('@unpm/screen-coords')
const remove  = require('remove-element')
const System  = require('@unpm/system')
const escape  = require('escape-html')
const Symbol  = require('es6-symbol')
const css     = require('dom-css')
const scratch = new Float32Array(2)

module.exports = gl => new Labels(gl)

class Labels extends System {
  constructor(gl) {
    super(gl)

    this.dirty     = true
    this.labels    = new Set()

    this.container = document.createElement('div')
    this.container.classList.add('unpm-label-container')
    document.body.appendChild(this.container)
  }

  addLabel(text, coord, rotate, fontSize) {
    var node     = document.createElement('div')
    var attached = false
    var label    = { node, text, coord, attached }

    node.innerHTML = escape(text)
    node.classList.add('unpm-label')

    if (rotate) css(node, 'transform', 'translate(-50%, -50%) rotate(90deg)')
    if (fontSize) css(node, 'font-size', fontSize + 'rem')

    this.dirty = true
    this.labels.add(label)

    return label
  }

  reset() {
    for (var label of this.labels.values()) {
      remove(label.node)
      label.coord = null
      label.node  = null
    }

    this.labels = new Set()
  }

  refresh() {
    this.dirty = true
  }

  tick(props) {
    if (!this.dirty) return

    for (var label of this.labels.values()) {
      var node = label.node
      var pos  = screen(label.coord, props, scratch)

      css(node, 'left', pos[0] + 'px')
      css(node, 'top', pos[1] + 'px')

      if (!label.attached) {
        this.container.appendChild(node)
        label.attached = true
      }
    }

    this.dirty = false
  }
}
