const fetch = require('@unpm/fetch-data')

module.exports = prefixes

const start = Date.now()

function prefixes(story, packages, labels, gui) {
  story.push({
    packagesLogScale: {
      value: false
    },
    packagesMetric1: {
      value: 'modified'
    },
    packagesMetric2: {
      value: 'devDependencies'
    },
    packagesCategory: {
      value: 'prefixes'
    },
    cameraPosition: {
      duration: 2000,
      value: [0, 0, -55],
      ease: require('eases/quart-in-out')
    },
    backgroundPosition: {
      value: [0, 0, 20],
      duration: 1000
    }
  }).on('enter', _ => packages.tStart = Date.now() + 500)
    .on('enter', _ => document.body.classList.add('unpm-prefixes-01'))
    .on('exit', _ => document.body.classList.remove('unpm-prefixes-01'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Prefixes: Intro'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Prefixes: Intro'))

  story.push({
    packagesMetric1: {
      value: 'modified'
    },
    packagesMetric2: {
      value: 'devDependencies'
    },
    cameraPosition: {
      value: [0, 0, -55]
    },
    packagesLogScale: {
      value: false
    }
  }).on('enter', enterAxes('', 'Number of Development Dependencies'))
    .on('enter', enterPrefixLabels)
    .on('exit', exitPrefixLabels)
    .on('enter', _ => document.body.classList.add('unpm-prefixes-02'))
    .on('exit', _ => document.body.classList.remove('unpm-prefixes-02'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Prefixes: DevDependencies'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Prefixes: DevDependencies'))

  story.push({
    cameraPosition: {
      value: [0, 0, -55]
    },
    packagesLogScale: {
      value: true
    },
    packagesMetric1: {
      value: 'modified'
    },
    packagesMetric2: {
      value: 'versions'
    }
  }).on('enter', enterAxes('', 'Versions Published (logarithmic)'))
    .on('enter', enterPrefixLabels)
    .on('exit', exitPrefixLabels)
    .on('enter', _ => document.body.classList.add('unpm-prefixes-03'))
    .on('exit', _ => document.body.classList.remove('unpm-prefixes-03'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Prefixes: Publish Count'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Prefixes: Publish Count'))

  story.push({
    cameraPosition: {
      value: [0, 0, -55]
    },
    packagesLogScale: {
      value: false
    }
  }).on('enter', _ => document.body.classList.add('unpm-play'))
    .on('exit', _ => document.body.classList.remove('unpm-play'))
    .on('enter', enterPrefixLabels)
    .on('exit', exitPrefixLabels)

  function enterAxes(x, y) {
    return _ => {
      setTimeout(_ => {
        labels.addLabel(x, [0, -16, 0], false)
        labels.addLabel(y, [+18, 0, 0], true)
      })
    }
  }

  function enterPrefixLabels() {
    fetch.prefixes.then(list => {
      labels.reset()

      Object.keys(list.index).forEach(name => {
        var idx = list.index[name]
        var col = Math.floor(idx / 7)
        var row = idx % 7

        if (name === 'false') name = 'Other'
        var x = (row-3)*5
        var y = (col-3)*5 // -2.85

        labels.addLabel(name, [x, y, 3], false, 0.55)
      })
    }).catch(err => {
      console.error(err)
    })
  }

  function exitPrefixLabels() {
    labels.reset()
  }

}
