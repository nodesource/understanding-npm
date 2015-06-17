const clamp = require('clamp')

module.exports = Transition

function Transition(name, params, values) {
  var delay    = params.delay || 0
  var duration = params.duration || 0
  var ease     = params.ease || require('eases/linear')
  var start    = values[name]
  var end      = params.value

  var apply = tweens[type(start)](start, end)
  var time  = 0

  return transition

  function transition(dt) {
    time += dt

    var t = duration
      ? (time - delay) / duration
      : time >= delay ? 1 : 0

    var u = t = clamp(t, 0, 1)

    t = ease(t)

    values[name] = apply(t)

    return u !== 1
  }
}

const tweens = {
  array(start, end) {
    var length = start.length
    var sliceS = start.slice()
    var sliceE = end.slice()

    return t => {
      for (var i = 0; i < length; i++) {
        start[i] = sliceS[i] + (sliceE[i] - sliceS[i]) * t
      }

      return start
    }
  },

  number(start, end) {
    return t => start + (end - start) * t
  },

  string(start, end) {
    return t => t > 0.5 ? end : start
  },

  boolean(start, end) {
    return t => t > 0.5 ? end : start
  }
}

function type(value) {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'string') return 'string'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object' && 'length' in value) {
    return 'array'
  }

  return 'number'
}
