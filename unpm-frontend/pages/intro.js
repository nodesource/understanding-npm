module.exports = intro

function intro(story, packages) {
  story.push({
    packagesLogScale: {
      value: false
    },
    backgroundPosition: {
      value: [0, 0, 0]
    },
    backgroundRotation: {
      value: 0
    },
    cameraPosition: {
      value: [-3.2835820895522403, -0.14925373134328268, 7.014925373134329]
    },
    cameraTarget: {
      value: [-1.7910447761194028, 0, 0]
    },
    packagesMode: {
      value: 'zero'
    },
    registryScale: {
      value: [1, 1, 1]
    },
    downloadEntry: {
      value: 0
    },
    packagesRadius: {
      value: 5
    },
    qualityThreshold: {
      value: 0
    },
    visibleQuality: {
      value: 0
    },
    packagesMetric1: {
      value: 'age'
    },
    highlightColor: {
      value: [1, 0.1, 0.1]
    }
  }).on('enter', function() {
    ga('_trackEvent', 'Enter Page', 'Intro')
    document.body.classList.add('unpm-intro')
    packages.resetPositions()
  }).on('exit', function() {
    ga('_trackEvent', 'Exit Page', 'Intro')
    document.body.classList.remove('unpm-intro')
  })

  story.push({
    cameraPosition: {
      value: [0, 0, 10],
      duration: 1200,
      ease: require('eases/cubic-in-out')
    },
    cameraTarget: {
      value: [0, 0, 0],
      duration: 1200,
      ease: require('eases/cubic-in-out')
    }
  }).on('enter', _ => document.body.classList.add('unpm-intro-registry'))
    .on('exit', __ => document.body.classList.remove('unpm-intro-registry'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Intro: Registry'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Intro: Registry'))
}
