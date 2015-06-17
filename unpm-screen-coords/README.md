# @unpm/screen-coords

Tiny module for converting taking a position in the scene's *world space* and
getting its displayed position on the screen, in pixels.

This is mostly a wrapper of
[from-3d-to-2d](http://github.com/hughsk/from-3d-to-2d).

# Usage

## `[x, y] = screenCoords(world, props, [out])`

Returns a 2D vector array providing the position of a coordinate on the screen.

* `world` is a 3D vector array containing the targeted position in world space.
* `props` is the shared properties object found in
  [`@unpm/frontend`](../unpm-frontend/), which should contain `width`, `height`
  and `mvp` properties.
* `out` is an optional array to fill, in order to reduce overhead from memory
  allocation. If not supplied, a new one will be created for your convenience.
