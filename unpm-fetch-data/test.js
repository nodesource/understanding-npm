const quantity = require('./quantity')
const category = require('./category')
const test     = require('tape')
const xhr      = require('xhr')
const fs       = require('fs')

test('fetch-data: quantities', function(t) {
  quantity('/fixtures/downloads.bin', Uint32Array).then(function(result) {
    t.equal(result.length, 256 * 128, 'length is correct')
    t.end()
  }, function(err) {
    t.ifError(err)
  })
})
test('fetch-data: categories', function(t) {
  category('/fixtures/licenses.bin', '/fixtures/licenses.json').then(function(result) {
    var expanded = result.expand()

    t.equal(expanded.length, 256 * 128, 'expanded length is correct')
    t.ok(expanded.indexOf('MIT') !== -1, 'includes MIT license somewhere')
    t.equal(result.items.length, 256 * 128, 'index length is correct')
    t.end()
  }, function(err) {
    t.ifError(err)
  })
})
