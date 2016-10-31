# Remington.js
## Text editing for the Web

`Remington` is a text editing library. It translates keyboard input to text with a cross-browser, easy-to-use API, and it tracks cursor location. `Remington` plays nicely with view-layer libraries like [React](https://reactjs.org) and [Vue](https://vuejs.org).

`Remington` is not a full text editor. It handles input and stores the text in memory; it does not have any opinions on how the data should be rendered or persisted.

## Installation
Download [`remington.js`](https://jdormit.github.io/remington/remington.js) or (minified) [`remington.min.js`](https://jdormit.github.io/remington/remington.min.js).

`Remington` is also available on NPM:

`npm install remington`

## Getting Started
```javascript
// You can attach a Remington instance to any element, as long as it is focusable.
// To make (say) a <div> focusable, give it a tabindex, e.g. <div tabindex="1"></div>
var myElement = document.getElementById('myElement');
var writer = new Remington(myElement);

// Now KeyboardEvents emitted by myElement will be caught and processed by Remington
});
```
## The Remington Instance
### `Remington(element)`
The Remington constructor. This is the default export of the Remington package.

```javascript
var writer = new Remington(myElement);
```

#### Arguments
`element {Element}`: The DOM element to which to attach this Remington instance.

#### Returns
A new `Remington` instance.

### Properties
#### `writer.buffer`
This `String` stores the current value of this instance's text buffer.

#### `writer.cursor`
This `Object` represents this instance's cursor.
```javascript
writer.cursor = {
    row: Number,
    col: Number
}
```

### Methods
#### `writer.moveCursor(row, col)`
Moves the cursor to the given position.

##### Arguments
`row {Number}`: The row to which to move the cursor.
`col {Number}`: The column to which to move the cursor.

## License
`Remington` is provided under the MIT license. See [`license.md`](./license.md) for details.
