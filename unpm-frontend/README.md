# @unpm/frontend

This is where everything gets wired together on the frontend, and the
browserify's target for bundling.

## Components

### bootstrap.js

The entry point for the bundle, which is run before beginning
the visualisation. It's loaded by [`@unpm/preloader`](../unpm-preloader/),
and preloads all of the promises in
[`@unpm/fetch-data`](../unpm-fetch-data/) before launching
`index.js`.

### index.css

The visualisation's CSS. Mostly used for queuing up the visibility of
each page's subtitles.

### index.html

The landing page. It's preprocessed for optimisation by
`inline.js`, but otherwise is where the copy for each
section is located.

### inline.js

Responsible for optimizing `index.html` by inlining and
minifying pieces of content when being served by
[`@unpm/server`](../unpm-server/).

### story-nav.js

The navigation logic for the arrows displayed on the page.

### pages/\*.js

Contains the "pages" of content for the site, determining
which properties to change at which points in time.
