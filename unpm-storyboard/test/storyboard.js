const test = require('tape')
const sb   = require('../').create()

test('storyboard: single page instant tween', t => {
  sb.values.target = [0, 0, 0]
  sb.values.fog    = 20

  sb.push({
    target: { value: [1, 1, 1] },
    fog: {
      value: 10,
      delay: 100
    }
  })

  t.deepEqual(sb.values.target, [0, 0, 0])
  t.deepEqual(sb.values.fog, 20)

  sb.jump(0)
  sb.tick(0)

  t.deepEqual(sb.values.target, [1, 1, 1])
  t.deepEqual(sb.values.fog, 20)

  sb.tick(50)

  t.deepEqual(sb.values.fog, 20)

  sb.tick(50)

  t.deepEqual(sb.values.fog, 10)
  t.end()
})
