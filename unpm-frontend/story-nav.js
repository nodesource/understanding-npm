module.exports = StoryboardNav

function StoryboardNav(story) {
  var prev = document.createElement('div')
  var next = document.createElement('div')

  prev.classList.add('unpm-navigation-prev')
  next.classList.add('unpm-navigation-next')

  ;[prev, next].forEach(function(nav) {
    nav.classList.add('unpm-navigation')
    document.body.appendChild(nav)
  })

  next.addEventListener('click', jump(+1), false)
  prev.addEventListener('click', jump(-1), false)

  function jump(n) {
    return function(e) {
      if (n > 0) {
        story.next()
      } else {
        story.prev()
      }

      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }
}
