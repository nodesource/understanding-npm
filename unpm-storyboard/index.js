const Symbol     = require('es6-symbol')
const Emitter    = require('events/')
const Transition = require('./transition')

const VISIT = Symbol('@unpm/storyboard/visit')

class Storyboard extends Emitter {
  constructor() {
    super()

    this.triggers = {}
    this.values   = {}
    this.pages    = []
    this.queue    = []
    this.page     = null
  }

  push(...values) {
    this.pages.push.apply(this.pages, values)
    if (values.length !== 1) return

    return this.triggers[this.pages.length - 1] = new Emitter
  }

  next() {
    this.jump(this.page !== null
      ? (this.page + 1 + this.pages.length) % this.pages.length
      : 0
    )
  }
  prev() {
    this.jump(this.page !== null
      ? (this.page - 1) % this.pages.length
      : 0
    )
  }

  jump(n) {
    if (this.page === n) return
    if (this.page === null) {
      return this[VISIT](this.pages[n])
    }

    // handle "loops", i.e. going from
    // last page to first page in a single jump
    if (!n && this.page === this.pages.length - 1) {
      return this[VISIT](this.pages[0])
    }

    const direction = n > this.page ? +1 : -1

    for (var i = this.page; i !== n; i += direction) {
      this[VISIT](this.pages[i])
    }

    this[VISIT](this.pages[n])
  }

  [VISIT](page) {
    var index = this.pages.indexOf(page)
    if (index === this.page) return

    if (this.page in this.triggers) {
      this.triggers[this.page].emit('exit')
      this.emit('exit', this.page)
    }

    this.page = index

    if (this.page in this.triggers) {
      this.triggers[this.page].emit('enter')
      this.emit('enter', this.page)
    }

    for (var name in page) {
      if (!page.hasOwnProperty(name)) continue

      var found = false

      for (var i = 0; i < this.queue.length; i++) {
        if (name === this.queue[i].name) {
          found = i
          break
        }
      }

      var fn = Transition(name, page[name], this.values)
      var tr = { name, fn }

      if (found === false) {
        this.queue.push(tr)
      } else {
        this.queue[found] = tr
      }
    }
  }

  tick(dt) {
    dt = Math.max(0, dt)

    for (var i = 0; i < this.queue.length; i++) {
      if (this.queue[i].fn(dt) === false) {
        this.queue.splice(i--, 1)
      }
    }
  }
}

module.exports = new Storyboard
module.exports.create = () => new Storyboard
