module.exports = quality

const start = Date.now()

function quality(story, download) {
  story.push({
    cameraPosition: {
      value: [5, 20, 2],
      duration: 2500,
      ease: require('eases/quart-in-out')
    },
    downloadExit: {
      value: 1,
      duration: 2500
    },
    packagesRadius: { value: 5 },
    qualityThreshold: { value: 0 },
    packagesMode: { value: 'test' },
  }).on('enter', _ => document.body.classList.add('unpm-quality-01'))
    .on('exit', __ => document.body.classList.remove('unpm-quality-01'))
    .on('enter', _ => download.endTime = (Date.now() - start) / 1000)
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Quality: Intro'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Quality: Intro'))

  story.push({
    qualityThreshold: { value: 2 },
    packagesMetric1: { value: 'quality' },
    packagesMode: { value: 'quality' },
    packagesRadius: { value: 4.5 }
  }).on('enter', _ => document.body.classList.add('unpm-quality-02'))
    .on('exit', __ => document.body.classList.remove('unpm-quality-02'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Quality: 2'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Quality: 2'))

  story.push({
    qualityThreshold: { value: 3 },
    packagesMode: { value: 'quality' },
    packagesMetric1: { value: 'quality' },
    packagesRadius: { value: 4 }
  }).on('enter', _ => document.body.classList.add('unpm-quality-03'))
    .on('exit', __ => document.body.classList.remove('unpm-quality-03'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Quality: 3'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Quality: 3'))

  story.push({
    qualityThreshold: { value: 4 },
    packagesMode: { value: 'quality' },
    packagesMetric1: { value: 'quality' },
    packagesRadius: { value: 3.5 }
  }).on('enter', _ => document.body.classList.add('unpm-quality-04'))
    .on('exit', __ => document.body.classList.remove('unpm-quality-04'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Quality: 4'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Quality: 4'))

  story.push({
    qualityThreshold: { value: 5 },
    packagesMode: { value: 'quality' },
    packagesMetric1: { value: 'quality' },
    packagesRadius: { value: 3 }
  }).on('enter', _ => document.body.classList.add('unpm-quality-05'))
    .on('exit', __ => document.body.classList.remove('unpm-quality-05'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Quality: 5'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Quality: 5'))

  story.push({
    qualityThreshold: { value: 5 },
    packagesMode: { value: 'quality' },
    packagesMetric1: { value: 'quality' },
    packagesRadius: { value: 3 }
  }).on('enter', _ => document.body.classList.add('unpm-quality-06'))
    .on('exit', __ => document.body.classList.remove('unpm-quality-06'))
    .on('enter', _ => ga('_trackEvent', 'Enter Page', 'Quality: Finish'))
    .on('exit', __ => ga('_trackEvent', 'Exit Page', 'Quality: Finish'))
}
