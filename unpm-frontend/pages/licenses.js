const fetch = require('@unpm/fetch-data')

module.exports = plots

const start = Date.now()

function plots(story, packages, labels) {
  story.push({
    packagesMode: {
      value: 'multiples',
      delay: 500
    },
    packagesMetric1: {
      value: 'modified'
    },
    packagesMetric2: {
      value: 'dependencies'
    },
    packagesCategory: {
      value: 'licenses'
    },
    packagesLogScale: {
      value: false
    },
    cameraPosition: {
      duration: 2000,
      value: [0, -1.2, -27],
      ease: require('eases/quart-in-out')
    },
    visibleQuality: {
      value: 0,
      duration: 750
    },
    packagesBrightness: {
      value: 10,
      duration: 500,
      ease: require('eases/quart-in-out')
    }
  }).on('enter', _ => packages.tStart = Date.now() + 500)
    .on('enter', _ => document.body.classList.add('unpm-licenses-01'))
    .on('exit', _ => document.body.classList.remove('unpm-licenses-01'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Licenses: Intro'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Licenses: Intro'))

  story.push({
    cameraPosition: {
      duration: 0,
      value: [0, -1.2, -27],
      ease: require('eases/quart-in-out')
    }
  }).on('enter', _ => document.body.classList.add('unpm-licenses-02'))
    .on('exit', _ => document.body.classList.remove('unpm-licenses-02'))
    .on('enter', enterAxes('Last Published', 'Number of Dependencies'))
    .on('enter', enterLicenseLabels)
    .on('exit', exitLicenseLabels)
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Licenses: Dependency Counts'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Licenses: Dependency Counts'))

  story.push({
    packagesMetric1: {
      value: 'modified'
    },
    packagesMetric2: {
      value: 'downloads'
    },
    packagesLogScale: {
      value: true
    }
  }).on('enter', _ => document.body.classList.add('unpm-licenses-03'))
    .on('exit', _ => document.body.classList.remove('unpm-licenses-03'))
    .on('enter', enterAxes('Last Published', 'Downloads (logarithmic)'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Licenses: Download Counts'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Licenses: Download Counts'))
    .on('enter', enterLicenseLabels)
    .on('exit', exitLicenseLabels)

  function enterAxes(x, y) {
    return _ => {
      setTimeout(_ => {
        labels.addLabel(x, [0, -7.7, 0], false)
        labels.addLabel(y, [+7.5, 0, 0], true)
      })
    }
  }

  function enterLicenseLabels() {
    fetch.licenses.then(list => {
      labels.reset()

      Object.keys(list.index).forEach(name => {
        var idx = list.index[name]
        var col = Math.floor(idx / 3)
        var row = idx % 3

        if (name === 'null') name = 'Other'
        var x = (row-1)*5
        var y = (col-1)*5 // -2.85

        labels.addLabel(name, [x, y, 3], false, 0.75)
      })
    }).catch(err => {
      console.error(err)
    })
  }

  function exitLicenseLabels() {
    labels.reset()
  }
}
