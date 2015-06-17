# @unpm/background

Renders the background scene (the wobbly grid and background coloring) to the
screen.

## Usage

### `background = Background(gl)`

Creates a new background instance given the `WebGLRenderingContext` `gl`.

### `background.position`

An `[x, y, z]` vector determining the position of the wobbly grid relative
to the world origin.

### `background.rotation`

A number specifying the rotation of the wobbly grid in radians.

### `background.enable`

Setting this value to `false` will prevent the background from rendering,
which may be useful for debugging.
