# Remington.js
## Easy keyboard input handling with JavaScript

`Remington` provides a wrapper around the [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) API. It allows developers to model keyboard input as a series of serializable, discrete changes, rather than resorting to messy hacks involving `input` elements or the `contenteditable` attribute. `Remington` can write changes directly to a `String`; this is extremely useful when combined with view-data-binding libraries such as [React](http://reactjs.org/) or [Vue](http://vuejs.org/).

## Installation

## Usage
```javascript
const myInputElement = document.getElementById('myinput');
const buffer = "";

// Update buffer whenever myInputElement fires a KeyboardEvent
const writer = Remington.register(myInputElement, buffer, keystrokes);
```
## License
`Remington` is provided under the MIT license. See [`license.md`](./license.md) for details.
