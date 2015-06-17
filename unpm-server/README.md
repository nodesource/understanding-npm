# @unpm/server

The server that's running on https://unpm.nodesource.com/.

Static files are being served up explicitly using
[course](http://github.com/hughsk/course) and [browserify](http://browserify.org)
is being used for bundling [`@unpm/frontend`](../unpm-frontend/).

Note that hard caching has been enabled on routes ending with a hash, e.g. `/bundle.b1946ac.js` will be cached indefinitely,
whereas `/bundle.js` will point to the same content but won't
be cached.
