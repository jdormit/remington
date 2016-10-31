/**
 * The Remington module
 * @module remington
 */
const keycodes = require('./keycodes');

/**
 * The Remington constructor
 * @constructor
 * @param {Element} element - the DOM element to which to attach this Remington instance
 */
const Remington = function(element) {
    const self = this;
    
    self.buffer = "";
    self.cursor = {
        row: 0,
        column: 0
    };
    
    element.addEventListener('keypress', function(event) {
        const character = String.fromCharCode(event.charCode);
        self.buffer += character;
    });
    element.addEventListener('keydown', function(event) {
        switch(event.keyCode) {
        case keycodes.ENTER:
            self.buffer += '\n'
            break;
        case keycodes.BACKSPACE:
            self.buffer = self.buffer.substring(0, self.buffer.length - 1);
            break;
        default:
            break;
        }
    });
}

module.exports = Remington;
