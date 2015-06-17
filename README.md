# [Understanding npm](https://unpm.nodesource.com)

A regularly updating survey of the [npm](http://npmjs.com/) community.

_Designed with love by [NodeSource](https://nodesource.com/) for our Node.js family._

[![understanding-npm](http://i.imgur.com/eD51eK0.jpg)](https://unpm.nodesource.com)

The project itself makes extensive use of npm. Once installed, there's a total of 406 unique packages in the dependency tree. Most notably:

* The visualisation is rendered using WebGL and [stack.gl](http://stack.gl) components.
* GLSL shaders are being managed using [glslify](http://github.com/stackgl/glslify).
* The frontend JavaScript is bundled using [browserify](http://browserify.org/).
* The data is aggregated using [dat](http://dat-data.com/), [dat-npm](https://github.com/mafintosh/dat-npm) and a [collection of other packages](https://github.com/nodesource/understanding-npm/tree/master/unpm-dat).

## Running the Site Locally

### Getting Started

Before you can run the site on your machine, you'll need to ensure that you
have the latest version of Node installed (especially important is `npm@2`,
which we use for scoped module support).

When you're ready, clone the repository from GitHub and install the
visualisation's dependencies from npm:

``` bash
git clone git@github.com:nodesource/understanding-npm.git
cd understanding-npm
npm install
```

Now, you should be ready to start the server up like so:

``` bash
npm start
```

### Updating the Registry Data

This is all done from the [`@unpm/dat`](./unpm-dat/) package, and requires you to
download >1GB of metadata from the npm registry, npm downloads API and GitHub API.
Depending on your location and connectivity, this could take anywhere from a day to
a week (requests have to be throttled to avoid hitting any rate limits).

A sample dataset has been prepared and included in the repository for everybody's
convenience, so you most likely won't have to deal with
this directly. If, however, you'd still like to update the
data locally you should check out the documentation in
[`@unpm/dat`'s README.md](./unpm-dat/README.md).

## Local Subpackages

The site is split out into smaller local packages that are installed with npm.
When developing, we use [`linklocal`](http://github.com/timoxley/linklocal) to
make this process easier.

Each package should have its own independent `README.md` documenting its purpose
and usage. Some notes on the packages included in this project:

* `@unpm`-scoped packages are part of the final project.
* `@nsight`-scoped packages are part of the final project, but likely to be reused in future N|Sight projects.
* `@x`-scoped packages are experiments, which are interesting for process documentation but not otherwise used in the final product.
* `gooey` is the only package unscoped package remaining (pending some reorganisation, and sorting out [a new name](http://npmjs.com/package/gooey)).

Some other packages that were born from this project include:

* [`index-list`](http://github.com/nodesource/index-list)
* [`rapid-stream`](http://github.com/nodesource/rapid-stream)
* [`lookat-camera`](http://github.com/stackgl/lookat-camera)
* [`glsl-scale-log`](http://github.com/stackgl/glsl-scale-log)
* [`glsl-scale-linear`](http://github.com/stackgl/glsl-scale-linear)
* [`md5ify`](http://github.com/hughsk/md5ify)

## Authors and Contributors

<table><tbody>
<tr><th align="left">Hugh Kennedy</th><td><a href="https://github.com/hughsk">GitHub/hughsk</a></td><td><a href="http://twitter.com/hughskennedy">Twitter/@hughskennedy</a></td></tr>
<tr><th align="left"> Paul DeVay</th><td><a href="https://github.com/pauldevay">GitHub/pauldevay</a></td><td><a href="http://twitter.com/pauldevay">Twitter/@pdevay</a></td></tr>
</tbody></table>

Contributions are welcomed from anyone wanting to improve this project!

## License & Copyright

**understanding-npm** is Copyright (c) 2015 NodeSource and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE.md file for more details.
