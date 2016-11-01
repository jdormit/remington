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

	var Remington = module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The Remington module
	 * @module remington
	 */

	const keycodes = __webpack_require__(2);
	const constants = __webpack_require__(3);

	/**
	 * The Remington constructor
	 * @constructor
	 * @param {Element} element - The DOM element to which to attach this Remington instance
	 */
	const Remington = function(element) {
	    const self = this;

	    /**
	     * The text buffer of the Remington instance
	     * @type {String}
	     */
	    self.buffer = "";

	    /**
	     * A list of rows in the buffer, used to index cursor locations
	     * @private
	     */
	    const rows = [];

	    /**
	     * The current cursor location, where text will be inputted into the buffer
	     * @type {Object}
	     * @property {Number} row - The current row
	     * @property {Number} col - The current column
	     */
	    self.cursor = {
	        row: 0,
	        col: 0
	    };

	    /** 
	     * The current index into the buffer
	     * @private
	     */
	    let currentIndex = 0;

	    /**
	     * Calculate the current index into the buffer based on cursor location
	     * @private
	     */
	    const calculateCurrentIndex = function() {
	        let index = 0;
	        let newlinesVisited = 0;
	        // first, find the beginning of the current row
	        while(newlinesVisited < self.cursor.row) {
	            index = self.buffer.indexOf(constants.NEWLINE, index);
	            newlinesVisited++;
	        }
	        // then, move the index to the current column
	        index += self.cursor.col;
	        currentIndex = index;
	    };

	    /**
	     * Generates a new string by removing existing characters and/or adding new characters
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
	     * The keypress event listener handles inserting regular characters
	     */
	    element.addEventListener('keypress', function(event) {
	        const character = String.fromCharCode(event.charCode);
	        self.buffer = self.buffer.splice(currentIndex, 0, character);
	        if (!rows[self.cursor.row]) {
	            rows[self.cursor.row] = "";
	        }
	        rows[self.cursor.row] = rows[self.cursor.row].splice(self.cursor.col, 0, character);
	        currentIndex++;
	        self.cursor.col++;
	    });

	    /**
	     * The keydown event listener handles non-character keys such as ENTER
	     */
	    element.addEventListener('keydown', function(event) {
	        switch(event.keyCode) {
	            case keycodes.ENTER: {
	                self.buffer = self.buffer.splice(currentIndex, 0, constants.NEWLINE);
	                currentIndex++;
	                if (!rows[self.cursor.row]) {
	                    rows[self.cursor.row] = "";
	                }
	                const remainingRow = rows[self.cursor.row].slice(currentIndex, rows[self.cursor.row].length);
	                rows[self.cursor.row] = rows[self.cursor.row].splice(currentIndex, constants.NEWLINE);
	                rows.splice(self.cursor.row, 0, remainingRow);
	                self.cursor.row++;
	                self.cursor.col = 0;
	                break;
	            }
	            case keycodes.BACKSPACE: {
	                // BACKSPACE deletes the character before the currentIndex, unless currentIndex is 0
	                if (currentIndex > 0) {
	                    self.buffer = self.buffer.splice(currentIndex - 1, 1);
	                    currentIndex--;
	                }
	                // if the cursor is at the beginning of a row, go the end of the previous row
	                if (self.cursor.col === 0 && self.cursor.row > 0) {
	                    // concatenate the current row with the previous one
	                    // and delete the newline at the end of the previous one
	                    rows[self.cursor.row] = rows[self.cursor.row].splice(rows[self.cursor.row - 1].length - 1, 1, rows[self.cursor.row]);
	                    self.cursor.row--;
	                    self.cursor.col = rows[self.cursor.row].length - 1;
	                }
	                // otherwise move the cursor back 1 column, unless it is at (0,0)
	                else if (!(self.cursor.col === 0 && self.cursor.row == 0)) {
	                    rows[self.cursor.row] = rows[self.cursor.row].splice(self.cursor.col - 1, 1);
	                    self.cursor.col--;
	                }
	                break;
	            }
	            default: {
	                break;
	            }
	        }
	    });
	}

	module.exports = Remington;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Keycode constants
	 */

	module.exports = {
	    "ENTER": 13,
	    "BACKSPACE": 8,
	    "TAB": 9,
	    "CTRL": 17,
	    "ALT": 18
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	    "NEWLINE": '\n'
	}


/***/ }
/******/ ]);