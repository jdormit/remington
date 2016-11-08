var Remington =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Remington = module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * The Remington module
	 * @module remington
	 */

	var keycodes = __webpack_require__(2);
	var constants = __webpack_require__(3);

	/**
	 * The Remington constructor
	 * @constructor
	 * @param {Element} element - The DOM element to which to attach this Remington instance
	 * @param {String|String[]} [initialText = ""] - Text to put in the buffer initially, as a string or an array of lines of text
	 * @param {Function} [inputCallback] - A callback that fires whenever the Remington instance detects input. Takes a single parameter, the event that was fired
	 */
	var Remington = function Remington(element) {
	    var initialText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
	    var inputCallback = arguments[2];

	    if (typeof initialText === 'function') {
	        inputCallback = initialText;
	        initialText = "";
	    }
	    var self = this;

	    /**
	     * The buffer of the Remington instance
	     * @private
	     * @typedef {Object} Buffer
	     * @property {String[]} rows - The buffer represented as an array of rows
	     */
	    var buffer = {
	        rows: []
	    };

	    /**
	     * Gets the buffer of the Remington instance as an array of rows
	     * @returns {Buffer} The buffer
	     */
	    self.getBuffer = function () {
	        return buffer.rows;
	    };

	    /**
	     * Gets the buffer of the Remington instance as a string.
	     * Unless a string is value is truly needed, prefer getBuffer(),
	     * as this is an expensive (O(n)) operation.
	     * @returns {String} The buffer as a string
	     */
	    self.getBufferText = function () {
	        var text = "";
	        for (var i in buffer.rows) {
	            text += buffer.rows[i];
	        }
	        return text;
	    };

	    /**
	     * Sets the buffer text
	     * @param {String|String[]} text - The text to set the buffer to, as either a string or an array of lines of text
	     */
	    self.setBufferText = function (text) {
	        if (Array.isArray(text)) {
	            buffer.rows = text;
	        } else {
	            var rows = text.split(constants.NEWLINE);
	            for (var i = 0; i < rows.length - 1; i++) {
	                rows[i] += constants.NEWLINE;
	            }
	            buffer.rows = rows;
	        }
	    };

	    /**
	     * The current cursor location, where text will be inputted into the buffer
	     * @private
	     * @type {Object}
	     * @property {Number} row - The current row
	     * @property {Number} col - The current column
	     */
	    var cursor = {
	        row: 0,
	        col: 0
	    };

	    self.getCursor = function () {
	        return cursor;
	    };

	    self.setCursor = function (col, row) {
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
	    var spliceString = function spliceString(start, deleteCount) {
	        for (var _len = arguments.length, items = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	            items[_key - 2] = arguments[_key];
	        }

	        if (typeof deleteCount === "string") {
	            items.splice(0, 0, deleteCount);
	            deleteCount = this.length - start;
	        }
	        var string = this.slice(0, start) + items.join('') + this.slice(start + deleteCount, this.length);
	        return string;
	    };

	    // Add splice as a non-enumerable read-only property of String.prototype
	    Object.defineProperty(String.prototype, 'splice', { value: spliceString });

	    /**
	     * The keypress event listener handles inserting regular characters
	     */
	    element.addEventListener('keypress', function (event) {
	        // catch any keypress events that should be handled as non-character keys
	        if (Object.values(keycodes).indexOf(event.keyCode) >= 0) {
	            return;
	        }
	        var character = String.fromCharCode(event.charCode);
	        if (!buffer.rows[cursor.row]) {
	            buffer.rows[cursor.row] = "";
	        }
	        buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col, 0, character);
	        cursor.col++;
	        if (inputCallback && typeof inputCallback === 'function') {
	            inputCallback(event);
	        }
	    });

	    /**
	     * The keydown event listener handles non-character keys such as ENTER
	     */
	    element.addEventListener('keydown', function (event) {
	        var validKey = true;
	        switch (event.keyCode) {
	            case keycodes.ENTER:
	                {
	                    if (!buffer.rows[cursor.row]) {
	                        buffer.rows[cursor.row] = "";
	                    }
	                    var remainingRow = buffer.rows[cursor.row].slice(cursor.col, buffer.rows[cursor.row].length);
	                    buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col, constants.NEWLINE);
	                    buffer.rows.splice(cursor.row + 1, 0, remainingRow);
	                    cursor.row++;
	                    cursor.col = 0;
	                    break;
	                }
	            case keycodes.BACKSPACE:
	                {
	                    // if the cursor is at the beginning of a row, go the end of the previous row
	                    if (cursor.col === 0 && cursor.row > 0) {
	                        // concatenate the current row with the previous one
	                        // and delete the newline at the end of the previous one
	                        buffer.rows[cursor.row - 1] = buffer.rows[cursor.row - 1].splice(buffer.rows[cursor.row - 1].length - 1, 1, buffer.rows[cursor.row]);
	                        buffer.rows.splice(cursor.row, 1);
	                        cursor.row--;
	                        cursor.col = buffer.rows[cursor.row].length;
	                    }
	                    // otherwise move the cursor back 1 column, unless it is at (0,0)
	                    else if (!(cursor.col === 0 && cursor.row == 0)) {
	                            buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col - 1, 1);
	                            cursor.col--;
	                        }
	                    break;
	                }
	            default:
	                {
	                    validKey = false;
	                    break;
	                }
	        }
	        if (validKey && inputCallback && typeof inputCallback === 'function') {
	            inputCallback(event);
	        }
	    });

	    if (initialText !== "") {
	        self.setBufferText(initialText);
	    }
	};

	module.exports = Remington;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Keycode constants
	 */

	module.exports = {
	    "ENTER": 13,
	    "BACKSPACE": 8,
	    "TAB": 9,
	    "CTRL": 17,
	    "ALT": 18
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    "NEWLINE": '\n'
	};

/***/ }
/******/ ]);