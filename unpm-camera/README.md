# @unpm/camera

An extended camera instance based on top of
[`lookat-camera`](http://github.com/stackgl/lookat-camera).

## Usage

The interface is the same as `lookat-camera`, with the exception of the
`.view` method:

### `camera.view(props)`

Updates the `props` object with the following properties:

* `props.view`: the view matrix of the scene.
* `props.proj`: the projection matrix of the scene.
* `props.eye`: the eye vector of the camera.
* `props.mvp`: a combine MVP matrix for the scene.

And depends on the following parameters being present in `props`:

* `fov`: the FOV angle of the scene in radians.
* `width`: the width of the canvas in pixels.
* `height`: the height of the canvas in pixels.
* `near`: the near distance threshold for the camera.
* `far`: the far distance threshold for the camera.
