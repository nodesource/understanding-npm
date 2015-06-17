# @unpm/labels

Responsible for managing text displayed on the screen in line
with content on the canvas.

## Usage

### `labels = Labels(gl)`

Creates a new instance of `@unpm/labels`.

### `labels.tick()`

Should be called once per frame – responsible for updating
the state of the labels when necessary. Positions are cached to
avoid thrashing the DOM too much.

### `labels.addLabel(text, coord, [rotate?, [fontSize]])`

Creates a new label.

* `text` is the text content of the label.
* `coord` is an `[x, y, z]` vector specifying the position of the text in *world space*.
* `rotate` is an optional boolean, and if set to `true` it will rotate
the text 90 degrees.
* `fontSize` the font size to use, in pixels. Uses the CSS-specified size by default.

### `labels.refresh()`

Forces a recalculation of the label positions.

### `labels.reset()`

Removes all current labels from the screen, allowing you
to start anew.
