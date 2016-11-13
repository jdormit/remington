/**
 * The Remington module
 * @module remington
 */

const keycodes = require('./keycodes');
const constants = require('./constants');

/**
 * The Remington constructor
 * @constructor
 * @param {Element} [element] - The DOM element to which to attach this Remington instance. If undefined, no event listeners will be registered
 * and the buffer can only be mutated using the Remington instance methods
 * @param {String|String[]} [initialText = ""] - Text to put in the buffer initially, as a string or an array of lines of text
 * @param {Function} [inputCallback] - A callback that fires whenever the Remington instance detects input. Takes a single parameter, the event that was fired
 */
const Remington = function(element, initialText = "", inputCallback) {
    if (typeof initialText === 'function') {
        inputCallback = initialText;
        initialText = "";
    }
    const self = this;

    /**
     * The buffer of the Remington instance
     * @private
     * @typedef {Object} Buffer
     * @property {String[]} rows - The buffer represented as an array of rows
     */
    const buffer = {
        rows: []
    };

    /**
     * Gets the buffer of the Remington instance as an array of rows
     * @returns {Buffer} The buffer
     */
    self.getBuffer = function() {
        return buffer.rows;
    }; 

    /**
     * Gets the buffer of the Remington instance as a string.
     * Unless a string is value is truly needed, prefer getBuffer(),
     * as this is an expensive (O(n)) operation.
     * @returns {String} The buffer as a string
     */
    self.getBufferText = function() {
        let text = "";
        for (let i in buffer.rows) {
            text += buffer.rows[i];
        }
        return text;
    };

    /**
     * Sets the buffer text
     * @param {String|String[]} text - The text to set the buffer to, as either a string or an array of lines of text
     */
    self.setBufferText = function(text) {
        if (Array.isArray(text)) {
            buffer.rows = text;
        }
        else {
            const rows = text.split(constants.NEWLINE);
            for (let i = 0; i < rows.length - 1; i++) {
                rows[i] += constants.NEWLINE;
            }
            buffer.rows = rows;
        }
    }

    /**
     * The current cursor location, where text will be inputted into the buffer
     * @private
     * @type {Object}
     * @property {Number} row - The current row
     * @property {Number} col - The current column
     */
    const cursor = {
        row: 0,
        col: 0
    };

    /**
     * Gets the cursor position
     */
    self.getCursor = function() {
        return cursor;
    };
    
    /**
     * Set the cursor position
     * If the new position is out of bounds, it will be set to the nearest valid position
     * @property {Number} col - The column to set the cursor to
     * @property {Number} row - The row to set the cursor to
     */
    self.setCursor = function(col, row) {
        if (row < 0) {
            row = 0;
        }
        else if (row > buffer.rows.length - 1) {
            row = buffer.rows.length - 1;
        }

        if (col < 0) {
            col = 0;
        }
        else if (col > buffer.rows[row].length - 1) {
            col = buffer.rows[row].length - 1;
        }
        
        cursor.col = col;
        cursor.row = row;
    };

    /**
     * Generates a new string by removing existing characters and/or adding new characters
     * @private
     * @param {Number} start - The index at which to start changing the string
     * @param {Number} [deleteCount] - The number of old characters to remove. If 0, no characters are removed. If omitted, equal to (string.length - start).
     * @params {...String} [items] - Characters or strings to add to the string
     * @returns {String} The modified string
     */
    const spliceString = function(start, deleteCount, ...items) {
        if (typeof deleteCount === "string") {
            items.splice(0, 0, deleteCount);
            deleteCount = this.length - start;
        }
        const string = this.slice(0, start) + items.join('') + this.slice(start + deleteCount, this.length);
        return string;
    }

    // Add splice as a non-enumerable read-only property of String.prototype
    Object.defineProperty(String.prototype, 'splice', {value: spliceString});

    /**
     * Sends a single character to the buffer and updates the cursor accordingly
     * @private
     * @param {String} character - the character to send to the buffer
     * @returns true to maintain compatibility with sendInput()
     */
    const handleCharacterInput = function(character) {
        if (!buffer.rows[cursor.row]) {
            buffer.rows[cursor.row] = "";
        }
        buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col, 0, character);
        cursor.col++;
        return true;
    }

    /**
     * Sends a non-character input (backspace, enter) to the buffer
     * @param {Number} keycode - the keycode of the key to send
     * @returns true if keycode is a valid key (one the Remington knows how to handle), false otherwise
     */
    const handleNonCharacterInput = function(keycode) {
        let validKey = true;
        switch(keycode) {
        case keycodes.SPACE: {
            if (!buffer.rows[cursor.row]) {
                buffer.rows[cursor.row] = "";
            }
            buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col, 0, constants.SPACE);
            cursor.col++;
            break;
        }
        case keycodes.ENTER: {
            if (!buffer.rows[cursor.row]) {
                buffer.rows[cursor.row] = "";
            }
            const remainingRow = buffer.rows[cursor.row].slice(cursor.col, buffer.rows[cursor.row].length);
            buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col, constants.NEWLINE);
            buffer.rows.splice(cursor.row + 1, 0, remainingRow);
            cursor.row++;
            cursor.col = 0;
            break;
        }
        case keycodes.BACKSPACE: {
            // if the cursor is at the beginning of a row, go the former end of the previous row
            if (cursor.col === 0 && cursor.row > 0) {
                // concatenate the current row with the previous one
                // and delete the newline at the end of the previous one
                let previousRowLength = buffer.rows[cursor.row - 1].length;
                buffer.rows[cursor.row - 1] = buffer.rows[cursor.row - 1].splice(previousRowLength - 1, 1, buffer.rows[cursor.row]);
                buffer.rows.splice(cursor.row, 1);
                cursor.row--;
                cursor.col = previousRowLength - 1;
            }
            // otherwise move the cursor back 1 column, unless it is at (0,0)
            else if (!(cursor.col === 0 && cursor.row == 0)) {
                buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col - 1, 1);
                cursor.col--;
            }
            break;
        }
        default: {
            validKey = false;
            break;
        }
        }
        return validKey;
    }
    
    /**
     * Sends input to the buffer
     * @param {String|Number} input - a keycode or character value to send to the buffer
     * @returns true if the Remington instance knew how to handle the input, false if otherwise
     */
    self.sendInput = function(input) {
        if (typeof input === "string") {
            if (input.length != 1) {
                throw new Error("Input must be processed one character at a time");
            }
            return handleCharacterInput(input);
        }
        else if (typeof input === "number") {
            // If the input is a keycode that Remington knows about, handle it
            if (Object.values(keycodes).indexOf(input) >= 0) {
                return handleNonCharacterInput(input);
            }
            // Otherwise, assume the input is a charCode representing a character
            else {
                const character = String.fromCharCode(input);
                return handleCharacterInput(character);
            }
        }
    }
    
    // Only register event listeners if an element is defined
    if (element) {

        /**
         * The keypress event listener handles inserting regular characters
         */
        element.addEventListener('keypress', function(event) {
            // Catch any keypress events that should be handled as non-character keys
            if (Object.values(keycodes).indexOf(event.keyCode) >= 0) {
                return;
            }
            const character = String.fromCharCode(event.charCode);
            handleCharacterInput(character);
            if (inputCallback && typeof inputCallback === 'function') {
                inputCallback(event);
            }
        });

        /**
         * The keydown event listener handles non-character keys such as ENTER
         */
        element.addEventListener('keydown', function(event) {
            const validKey = handleNonCharacterInput(event.keyCode);
            if (validKey && inputCallback && typeof inputCallback === 'function') {
                event.preventDefault();
                event.stopPropagation();
                inputCallback(event);
            }
        });
        
    }

    if (initialText !== "") {
        self.setBufferText(initialText);
    }
}

module.exports = Remington;
