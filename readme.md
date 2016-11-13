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
```
## The Remington Instance
### `Remington(element, initialText, inputCallback)`
The Remington constructor. This is the default export of the Remington package.

```javascript
var writer = new Remington(myElement);
```

#### Arguments
`element {Element}`: The DOM element to which to attach this Remington instance. This can be `null` or `undefined`; if it is, then no event listeners will be registered. In that case, the only way to modify the buffer is through the Remington instance methods.

`initialText {String}`: Optional. This text will start in the Remington instance's buffer.

`inputCallback {Function}`: Optional. The function is called whenever the Remington instance detects input. It is called once per character inputted.

#### Returns
A new `Remington` instance.

### Methods
#### `writer.getBuffer()`
Returns this Remington instance's buffer. The buffer is stored as an array of strings, where each string is a row of text.

#### `writer.getBufferText()`
Returns a string representation of the instance's buffer. This is computationally expensive, so `writer.getBuffer()` is preferred unless a string representation is absolutely necessary.

#### `writer.setBufferText(text)`
Sets this instance's buffer text to `text`. The text is broken into rows based on newlines.

##### Arguments
`text {String}`: The text to set the buffer to.

#### `writer.sendInput(input)`
Sends input, either a single character or a keycode, to the Remington instance.

##### Arguments
`input {String|Number}`: If a string, then this must be a single character to send to the Remington buffer. If a number, this must be a valid keycode the Remington knows how to handle.

##### Return Value
`true` if the Remington instance properly handled the input; `false` if otherwise.

#### `writer.getCursor()`
This returns the `Object` representing this instance's cursor.
```javascript
cursor = {
    row: Number,
    col: Number
}
```
#### `writer.setCursor(col, row)`
This sets the cursor position to (`col`, `row`).

##### Arguments
`col`: The cursor's new column position.

`row`: The cursor's new row position.

## Example Usage
This is a *very hacky* example of usage, shown only to introduce the library. For production use, a view-layer framework like React or Vue is recommended for rendering the buffer and cursor.

```html
<!DOCTYPE html>
<html>
    <head>
        <script type="text/javascript" src="remington.js"></script>
        <style>
         #editorDiv {
             width: 500px;
             height: 750px;
             border: 1px solid black;
             white-space: pre;
         }
         #cursor {
             position: absolute;
             border-left: 1px solid black;
             background: transparent;
             width: 1em;
         }
         #sizeCalculator {
             white-space: pre;
             position: absolute;
             opacity: 0;
         }
        </style>
    </head>
    <body>
        <span id="sizeCalculator"></span>
        <div id="editorDiv" tabindex="1"></div>
        <script type="text/javascript">
         var editorDiv = document.getElementById('editorDiv');
         var writer = new Remington(editorDiv, function(inputEvent) {
             // Render the buffer
             editorDiv.innerHTML = "";
             for (i in writer.getBuffer()) {
                 var row = writer.getBuffer()[i];
                 var rowDiv = document.createElement('div'); 
                 rowDiv.id = i;
                 var rowText = document.createTextNode(row);
                 rowDiv.appendChild(rowText);
                 editorDiv.appendChild(rowDiv);
             }
             // Render the cursor
             var lineHeight = lineHeight || document.getElementById(0).offsetHeight;
             var cursorDiv = document.createElement('div');
             cursorDiv.id = "cursor";
             cursorDiv.style.height = lineHeight - 2 + "px";
             // Calculate the height offset
             var sizeCalculator = document.getElementById("sizeCalculator");
             var textToCursor = "";
             for (var i = 0; i < writer.getCursor().row; i++) {
                 var rowText = document.getElementById(i).innerText;
                 textToCursor += rowText;
             }
             sizeCalculator.innerText = textToCursor;
             cursorDiv.style.top = sizeCalculator.offsetHeight + 9 + "px";
             // Calculate the width offset
             textToCursor = "";
             for (var i = 0; i < writer.getCursor().col; i++) {
                 var char = document.getElementById(writer.getCursor().row).innerText[i];
                 textToCursor += char;
             }
             sizeCalculator.innerText = textToCursor;
             var leftPos = sizeCalculator.offsetWidth + 9;
             cursorDiv.style.left = leftPos + "px";
             editorDiv.appendChild(cursorDiv);
         });
         // Hacky blinking cursor
         var visible = true;
         setInterval(function() {
             var cursorDiv = document.getElementById('cursor');
             if (!cursorDiv) return;
             if (visible) {
                 visible = false;
                 cursorDiv.style.opacity = 0;
             } else {
                 visible = true;
                 cursorDiv.style.opacity = 100;
             }
         }, 500);
        </script>
    </body>
</html>
```

## License
`Remington` is provided under the MIT license. See [`license.md`](./license.md) for details.
