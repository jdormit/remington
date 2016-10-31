/**
 * The Remington module
 * @module remington
 */
const keycodes = require('./keycodes');

/**
 * Registers an input listener on an elements and binds the output to a buffer string
 * @param {Element} element - The element that will be emitting keyboard events
 * @param {String} [buffer] - Output will be written to this string, if given
 */
exports.register = function(element, buffer) {
    element.addEventListener('keypress', function(event) {
        const character = String.fromCharCode(event.charCode);
        buffer += character;
    });
    element.addEventListener('keydown', function(event) {
        switch(event.keyCode) {
            case keycodes.ENTER:
                buffer += '\n'
                break;
            case keycodes.BACKSPACE:
                buffer = buffer.substring(0, buffer.length - 1);
                break;
            default:
                break;
        }
    });
};
