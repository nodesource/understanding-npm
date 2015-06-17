const Promise = require('es6-promise').Promise
const Event   = require('synthetic-dom-events')
const fetch   = require('@unpm/fetch-data')

var targets  = Object.keys(fetch).map(key => fetch[key])
var total    = targets.length
var resolved = 1

targets = targets.map(target => {
  return new Promise((resolve, reject) => {
    target.then(result => {
      window.dispatchEvent(Event('unpm:progress', {
        count: resolved++,
        total: total
      }))

      resolve(result)
    }, reject)
  })
})

Promise.all(targets).then(function() {
  var cover = document.createElement('div')
  cover.style.opacity = 1
  cover.style.transition = 'opacity 1s'
  cover.style.background = '#21122F'
  cover.style.position = 'absolute'
  cover.style.pointerEvents = 'none'
  cover.style.top =
  cover.style.left =
  cover.style.right =
  cover.style.bottom = 0
  cover.style.zIndex = 9

  window.dispatchEvent(Event('unpm:ready', {}))
  setTimeout(_ => document.body.appendChild(cover), 500)
  setTimeout(_ => require('./index'), 650)
  setTimeout(_ => cover.style.opacity = 0, 1000)
  setTimeout(_ => document.body.removeChild(cover), 2000)
}, err => {throw err})
