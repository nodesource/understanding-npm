const sb1  = require('../').create()
const sb2  = require('../').create()
const test = require('tape')

test('enter/exit', t => {
  var first = true
  var n    = 0

  t.plan(14)

  sb1.push({})
    .on('enter', _ => t.equal(++n, 1, 'entered 1'))
    .on('exit', _ => t.equal(++n, 2, 'exited 1'))

  sb1.push({})
    .on('enter', _ => t.equal(++n, first ? 3 : 7, 'entered 2'))
    .on('exit', _ => t.equal(++n, 4, 'exited 2'))

  sb1.push({})
    .on('enter', _ => t.equal(++n, 5, 'entered 3'))
    .on('exit', _ => t.equal(++n, 6, 'exited 3'))

  sb1.on('enter', m => t.pass('enter triggered'))
  sb1.on('exit', m => t.pass('exit triggered'))

  sb1.jump(0)
  sb1.jump(1)
  first = false
  sb1.jump(2)
  sb1.jump(1)
})

test('enter/exit II', t => {
  var prefixes = 10
  var enters   = 0
  var exits    = 0

  sb2.values = {
    name: 'hello world'
  }

  for (var i = 0; i < prefixes; i++) {
    sb2.push({})
  }

  sb2.push({
    name: {
      value: 'hello again'
    }
  }).on('enter', _ => enters++)

  sb2.push({})
    .on('exit', _ => exits++)

  for (var j = 0; j < 5; j++) {
    for (var i = 0; i < prefixes + 2; i++) {
      sb2.next()
    }
  }

  sb2.next()

  t.equal(enters, 5, 'caught all enters')
  t.equal(exits, 5, 'caught all exits')
  t.end()
})
