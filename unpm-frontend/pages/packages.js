module.exports = packages

function packages(story, packages) {
  story.push({
    cameraPosition: {
      value: [3, 0, 4],
      duration: 2000,
      ease: require('eases/back-in-out')
    },
    cameraTarget: {
      value: [3, 0, -2],
      duration: 900,
      ease: require('eases/back-in-out')
    },
    packagesBrightness: {
      value: 8
    },
    packagesMode: {
      value: 'single'
    }
  }).on('enter', _ => document.body.classList.add('unpm-intro-package-solo'))
    .on('exit', _ => document.body.classList.remove('unpm-intro-package-solo'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Packages: Intro'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Packages: Intro'))

  story.push({
    cameraPosition: {
      value: [0, 0, 4.2],
      duration: 500,
      ease: require('eases/circ-in-out')
    },
    cameraTarget: {
      value: [0, 0, 0],
      duration: 500,
      ease: require('eases/circ-in-out')
    }
  }).on('enter', _ => document.body.classList.add('unpm-intro-package'))
    .on('exit', _ => document.body.classList.remove('unpm-intro-package'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Packages: Prelude'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Packages: Prelude'))

  story.push({
    cameraPosition: {
      value: [0, 0, 20],
      duration: 15000,
      ease: require('eases/quart-in-out')
    },
    packagesMode: {
      value: 'flood'
    },
    packagesBrightness: {
      value: 3,
      duration: 15000
    },
    registryScale: {
      value: [0, 0, 0],
      duration: 13000,
      delay: 3000
    },
    backgroundRotation: {
      value: 0
    },
    backgroundPosition: {
      duration: 2000,
      value: [0, 0, 0],
      ease: require('eases/quart-out')
    },
    downloadEntry: {
      value: 0
    },
    downloadExit: {
      value: 0
    }
  }).on('enter', _ => packages.tStart = Date.now())
    .on('enter', _ => document.body.classList.add('unpm-intro-package-grow'))
    .on('exit', _ => document.body.classList.remove('unpm-intro-package-grow'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Packages: Growth'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Packages: Growth'))

}
