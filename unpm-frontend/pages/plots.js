module.exports = plots

const start = Date.now()

function plots(story, packages, labels) {
  story.push({
    packagesMode: {
      value: 'plot',
      delay: 2000
    },
    packagesMetric1: {
      value: 'modified'
    },
    packagesMetric2: {
      value: 'downloads'
    },
    cameraTarget: {
      duration: 5000,
      value: [0, -1.2, 0],
      ease: require('eases/quart-in-out')
    },
    cameraPosition: {
      duration: 5000,
      value: [0, -1.2, -10],
      ease: require('eases/quart-in-out')
    }
  }).on('enter', _ => packages.tStart = Date.now())
    .on('enter', _ => document.body.classList.add('unpm-plots-00'))
    .on('exit', _ => document.body.classList.remove('unpm-plots-00'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Plots: Intro'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Plots: Intro'))

  story.push({
    cameraTarget: {
      value: [0, -1.2, 0]
    },
    cameraPosition: {
      value: [0, -1.2, -10]
    },
    packagesMetric1: {
      value: 'modified'
    },
    packagesMetric2: {
      value: 'downloads'
    }
  }).on('enter', _ => document.body.classList.add('unpm-plots-02'))
    .on('exit', _ => document.body.classList.remove('unpm-plots-02'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Plots: Weekly Downloads'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Plots: Weekly Downloads'))
    .on('exit', _ => labels.reset())
    .on('enter', _ => {
      labels.addLabel('Downloads per Week', [+2.8, 0, 0], true)
      labels.addLabel('Last Updated', [0, -3, 0], false)
    })

  story.push({
    packagesMetric1: {
      value: 'modified'
    },
    packagesMetric2: {
      value: 'stars'
    }
  }).on('enter', _ => packages.tStart = Date.now())
    .on('enter', _ => document.body.classList.add('unpm-plots-03'))
    .on('exit', _ => document.body.classList.remove('unpm-plots-03'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Plots: GitHub Stars'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Plots: GitHub Stars'))
    .on('exit', _ => labels.reset())
    .on('enter', _ => {
      labels.addLabel('Project Stars', [+2.8, 0, 0], true)
      labels.addLabel('Last Updated', [0, -3, 0], false)
    })

  story.push({
    packagesMetric1: {
      value: 'downloads'
    },
    packagesMetric2: {
      value: 'stars'
    },
    cameraTarget: {
      value: [0, -1.2, 0]
    },
    cameraPosition: {
      value: [0, -1.2, -10]
    },
    packagesMode: {
      value: 'plot'
    }
  }).on('enter', _ => packages.tStart = Date.now())
    .on('enter', _ => document.body.classList.add('unpm-plots-04'))
    .on('exit', _ => document.body.classList.remove('unpm-plots-04'))
    .on('exit', _ => labels.reset())
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Plots: Stars vs Downloads'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Plots: Stars vs Downloads'))
    .on('enter', _ => {
      labels.addLabel('Project Stars', [+2.8, 0, 0], true)
      labels.addLabel('Downloads per Week', [0, -3, 0], false)
    })
}
