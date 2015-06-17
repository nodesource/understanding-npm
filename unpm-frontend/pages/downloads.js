module.exports = downloads

const start = Date.now()

function downloads(story, download) {
  story.push({
    cameraPosition: {
      value: [0, 0, 20],
      duration: 2500,
      ease: require('eases/quad-in-out')
    },
    registryScale: {
      value: [0, 0, 0],
      duration: 2500
    },
    packagesMode: {
      value: 'test'
    },
    downloadEntry: {
      value: 1
    },
    downloadBeam: {
      value: false
    },
    backgroundPosition: {
      value: [0, 0, 10],
      duration: 4000,
      ease: require('eases/quint-in')
    },
    backgroundRotation: {
      value: Math.PI * 4,
      duration: 6000,
      ease: require('eases/quart-in')
    }
  }).on('enter', _ => {
    download.startTime = (Date.now() - start) / 1000
    document.body.classList.add('unpm-downloads-01')
  }).on('exit', __ => document.body.classList.remove('unpm-downloads-01'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Downloads: Entry'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Downloads: Entry'))

  story.push({
    downloadExit: { value: 0 },
    downloadBeam: { value: true }
  }).on('enter', _ => document.body.classList.add('unpm-downloads-02'))
    .on('exit', __ => document.body.classList.remove('unpm-downloads-02'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Downloads: Beam'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Downloads: Beam'))
}
