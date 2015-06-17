# @unpm/storyboard

Manages animations/tweening/parameters across different pages in a linear
order.

## Usage

### `storyboard = require('@unpm/storyboard')`

This package exports a `storyboard` singleton.

### `s = new storyboard.Storyboard`

You can, however, create new storyboards using the exported `Storyboard` value.

### `page = storyboard.push(pageSettings)`

Adds a new page to the storyboard. `pageSettings` is an object where each
changing parameter is named by its key, and its behaviour is determined by
that key's value. The following will immediately set `myParameter` to 10:

``` javascript
storyboard.push({
  myParameter: {
    value: 10
  }
})
```

You may also pass in a few additional parameters:

* `duration`: the duration of the transition in milliseconds.
* `delay`: the delay before running the transition in milliseconds.
* `ease`: the easing function to use for the transition.

``` javascript
storyboard.push({
  myParameter: {
    ease: require('eases/bounce-in-out'),
    duration: 1000,
    delay: 100,
    value: 10
  }
})
```

You can then build up a "narrative" by pushing subsequent pages to change
content.

### `page.on('enter', fn)`

After creating a page you can listen for the `enter` event, calling `fn`
whenever the page is navigated to.

``` javascript
storyboard.push({
  myParameter: { value: 10 }
}).on('enter', _ => console.log('visiting a page!'))
```

### `page.on('exit', fn)`

After creating a page you can listen for the `exit` event, calling `fn`
whenever the page is navigated away from.

``` javascript
storyboard.push({
  myParameter: { value: 10 }
}).on('exit', _ => console.log('leaving a page!'))
```

### `storyboard.values`

An object containing the currently set values in the storyboard:

``` javascript
storyboard.values.myParameter === 10
```

### `storyboard.tick(dt)`

To be called each frame in an animation loop. `dt` should be the amount of
milliseconds elapsed between the current and previous frame.

### `storyboard.next()`

Moves to the next page, triggering any animations and events as required.

### `storyboard.prev()`

Moves to the previous page, triggering any animations and events as required.

### `storyboard.jump(i)`

Moves directly to a page at index `i` in the storyboard's list by calling
`.next()` or `.prev()` until it reaches the correct point. This is useful for
navigating through the storyboard without running as much risk of missing any
important variables on any pages in between.

### `storyboard.on('exit', fn)`

Calls `fn` whenever the storyboard leaves a page.

### `storyboard.on('enter', fn)`

Calls `fn` whenever the storyboard navigates to new page. This will always
follow immediately after an `exit` event.
