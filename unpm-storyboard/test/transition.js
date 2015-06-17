const Transition = require('../transition')
const test       = require('tape')

test('transition: number', t => {
  const values = {
    first: 100
  }

  const data = {
    duration: 1000,
    delay: 500,
    value: 600
  }

  var T = Transition('first', data, values)

  t.equal(T(250), true)
  t.equal(values.first, 100)

  t.equal(T(250), true)
  t.equal(values.first, 100)

  t.equal(T(250), true)
  t.equal(values.first, 225)

  t.equal(T(250), true)
  t.equal(values.first, 350)

  t.equal(T(500), false)
  t.equal(values.first, 600)

  t.equal(T(500), false)
  t.equal(values.first, 600)

  t.end()
})

test('transition: array', t => {
  const values = {
    first: [0, 100, 0]
  }

  const data = {
    duration: 1000,
    delay: 250,
    value: [100, 0, 50]
  }

  var T = Transition('first', data, values)

  t.equal(T(250), true)
  t.deepEqual(values.first, [0, 100, 0])

  t.equal(T(250), true)
  t.deepEqual(values.first, [25, 75, 12.5])

  t.equal(T(250), true)
  t.deepEqual(values.first, [50, 50, 25])

  t.equal(T(250), true)
  t.deepEqual(values.first, [75, 25, 37.5])

  t.equal(T(250), false)
  t.deepEqual(values.first, [100, 0, 50])

  t.end()
})
