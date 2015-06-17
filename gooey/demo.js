var gui = require('./')().attach()

gui.add('boolean_toggle', require('./toggle')(true)
  .on('change', function() {
    console.log('boolean_toggle:', this.value)
  }))

gui.add('exposure', require('./slider')(0.5, 0, 1))
gui.on('exposure', function(value) {
  console.log('exposure:', value)
})

gui.add('fog_distance', require('./slider')(5, -10, 10))
gui.on('fog_distance', function(value) {
  console.log('fog_distance:', value)
})

var p1, p2, p3, p4, p5

gui.add('particle_mode', require('./list')(null, {
  'first choice':  p1 = { id: 1 },
  'second choice': p2 = { id: 2 },
  'third choice':  p3 = { id: 3 },
  'fourth choice': p4 = { id: 4 },
  'fifth choice':  p5 = { id: 5 }
}).on('change', function() {
  console.log('particle_mode:', this.value)
}))

setTimeout(function() {
  gui.elements['particle_mode'].set(p5)
  gui.elements['boolean_toggle'].set(false)
}, 1000)

setTimeout(function() {
  gui.elements['boolean_toggle'].set(true)
}, 3500)
