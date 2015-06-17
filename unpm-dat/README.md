# @unpm/dat

[Dat-powered](http://dat-data.com/) mirroring and processing of the npm registry. Uses
[dat-npm](https://github.com/mafintosh/dat-npm) to do the heavy lifting.

Required to update the data we're displaying, but not
required to run the visualisation itself (the
production-ready data is smallish and has been committed in
the [`data`](data/) directory).

## Setting It Up

Firstly, install the required dependencies and kick off the npm
registry copy and dat server:

``` bash
cd unpm-dat
npm install
npm start
```

This can take a while, so you'll want to make sure that it's being
run somewhere you can rely on the files sticking around. I've been
running it from Australian cafes and houses for close to three days
and I've got about 95,000 of npm's 145,000 packages collected, but
it's likely to be a lot faster running on a remote server.

Once you're satisfied with the amount of data collected, you can
collect the remaining data from other sources (currently, npm's
downloads API and the GitHub API for stars):

``` bash
npm run harvest
```

Once you've run `harvest` once, it should be safe to rebuild the
registry data using the following:

``` bash
npm run rebuild
```

## What's Going On

### dat-npm

[dat-npm](https://github.com/mafintosh/dat-npm) builds a
running copy of the registry's metadata that may be queried
as a key/value store.

This is where the bulk of our data is coming from – we then
extract the important bits using [`index.js`](index.js).

### downloads.js

npm has an API that provides packages' download statistics.
This script collects *all* of the package download counts
from the API, and then determines the top 32,768 packages
which are saved in `data/_downloads.json` alongside their
download counts.

Once we've determined the packages we're actually going to
be using in the visualisation, we can ignore the other 100,000+
packages in the registry, speeding up the rest of the
aggregation process.

### stars.js

We then run through each top-downloaded package and, if
it's possible to find their git repository, find out how
many stars they have. This is a bit precarious because
of GitHub's API limit of 5,000 reqs/hr. This is taken
into account, and the rate of requests is tweaked dynamically
to stay within the limit.

### index.js

This takes the above data sources and builds out the final
files, ready to be loaded in the frontend. The files aren't
people-friendly though: this is in the interest of limiting
the amount of data required to be sent over the wire.

The names of the packages are stored in a JSON array.
We can then load numerical data into a Typed Array and
save the binary data directly to a file. These are easy
to load into the browser and turn back into a Typed Array.
We can match up the names and numerical arrays easily this
way.

Categorical data, such as prefixes and licenses, use
[`index-list`](http://github.com/nodesource/index-list) to
minimise any redundant repetition. We can then somewhat
neatly use the Typed Array approach for storing their indexes too.

### stats.js

Once everything is aggregated we perform one final pass in `stats.js`,
producing `stats.json` which contains individual statistics such as
total weekly downloads, package count, and so on.

## Recommended Timing for Automatic Updates

The dat registry sync is a continuous process: it'll keep
downloading package data as they're published to the registry.
You'll want to keep this running somewhere, collecting data
where possible.

The harvest script takes a long time to run, even when its
cache is reasonably populated. Each packages' download/star
counts are cached for a week. You'll probably want to run
this script once every couple of days to grab new packages.

GitHub API limits are worth noting here: with an unpopulated
cache, it's likely to take anywhere from 6 to 12 hours to
complete.
