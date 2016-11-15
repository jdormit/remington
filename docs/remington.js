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

	var values = __webpack_require__(1);
	if (!Object.values) {
	    values.shim();
	}
	var Remington = module.exports = __webpack_require__(28);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var define = __webpack_require__(2);

	var implementation = __webpack_require__(6);
	var getPolyfill = __webpack_require__(26);
	var shim = __webpack_require__(27);

	define(implementation, {
		getPolyfill: getPolyfill,
		implementation: implementation,
		shim: shim
	});

	module.exports = implementation;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys = __webpack_require__(3);
	var foreach = __webpack_require__(5);
	var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

	var toStr = Object.prototype.toString;

	var isFunction = function (fn) {
		return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
	};

	var arePropertyDescriptorsSupported = function () {
		var obj = {};
		try {
			Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
	        /* eslint-disable no-unused-vars, no-restricted-syntax */
	        for (var _ in obj) { return false; }
	        /* eslint-enable no-unused-vars, no-restricted-syntax */
			return obj.x === obj;
		} catch (e) { /* this is IE 8. */
			return false;
		}
	};
	var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

	var defineProperty = function (object, name, value, predicate) {
		if (name in object && (!isFunction(predicate) || !predicate())) {
			return;
		}
		if (supportsDescriptors) {
			Object.defineProperty(object, name, {
				configurable: true,
				enumerable: false,
				value: value,
				writable: true
			});
		} else {
			object[name] = value;
		}
	};

	var defineProperties = function (object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = keys(map);
		if (hasSymbols) {
			props = props.concat(Object.getOwnPropertySymbols(map));
		}
		foreach(props, function (name) {
			defineProperty(object, name, map[name], predicates[name]);
		});
	};

	defineProperties.supportsDescriptors = !!supportsDescriptors;

	module.exports = defineProperties;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var slice = Array.prototype.slice;
	var isArgs = __webpack_require__(4);
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	var keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};

	keysShim.shim = function shimObjectKeys() {
		if (Object.keys) {
			var keysWorksWithArguments = (function () {
				// Safari 5.0 bug
				return (Object.keys(arguments) || '').length === 2;
			}(1, 2));
			if (!keysWorksWithArguments) {
				var originalKeys = Object.keys;
				Object.keys = function keys(object) {
					if (isArgs(object)) {
						return originalKeys(slice.call(object));
					} else {
						return originalKeys(object);
					}
				};
			}
		} else {
			Object.keys = keysShim;
		}
		return Object.keys || keysShim;
	};

	module.exports = keysShim;


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var toStr = Object.prototype.toString;

	module.exports = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' &&
				value !== null &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				value.length >= 0 &&
				toStr.call(value.callee) === '[object Function]';
		}
		return isArgs;
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	
	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;

	module.exports = function forEach (obj, fn, ctx) {
	    if (toString.call(fn) !== '[object Function]') {
	        throw new TypeError('iterator must be a function');
	    }
	    var l = obj.length;
	    if (l === +l) {
	        for (var i = 0; i < l; i++) {
	            fn.call(ctx, obj[i], i, obj);
	        }
	    } else {
	        for (var k in obj) {
	            if (hasOwn.call(obj, k)) {
	                fn.call(ctx, obj[k], k, obj);
	            }
	        }
	    }
	};



/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ES = __webpack_require__(7);
	var has = __webpack_require__(25);
	var bind = __webpack_require__(20);
	var isEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);

	module.exports = function values(O) {
		var obj = ES.RequireObjectCoercible(O);
		var vals = [];
		for (var key in obj) {
			if (has(obj, key) && isEnumerable(obj, key)) {
				vals.push(obj[key]);
			}
		}
		return vals;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ES6 = __webpack_require__(8);
	var assign = __webpack_require__(11);

	var ES7 = assign(ES6, {
		// https://github.com/tc39/ecma262/pull/60
		SameValueNonNumber: function SameValueNonNumber(x, y) {
			if (typeof x === 'number' || typeof x !== typeof y) {
				throw new TypeError('SameValueNonNumber requires two non-number values of the same type.');
			}
			return this.SameValue(x, y);
		}
	});

	module.exports = ES7;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toStr = Object.prototype.toString;
	var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';
	var symbolToStr = hasSymbols ? Symbol.prototype.toString : toStr;

	var $isNaN = __webpack_require__(9);
	var $isFinite = __webpack_require__(10);
	var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

	var assign = __webpack_require__(11);
	var sign = __webpack_require__(12);
	var mod = __webpack_require__(13);
	var isPrimitive = __webpack_require__(14);
	var toPrimitive = __webpack_require__(15);
	var parseInteger = parseInt;
	var bind = __webpack_require__(20);
	var strSlice = bind.call(Function.call, String.prototype.slice);
	var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
	var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
	var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
	var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
	var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
	var invalidHexLiteral = /^[\-\+]0x[0-9a-f]+$/i;
	var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

	// whitespace from: http://es5.github.io/#x15.5.4.20
	// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
	var ws = [
		'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
		'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
		'\u2029\uFEFF'
	].join('');
	var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
	var replace = bind.call(Function.call, String.prototype.replace);
	var trim = function (value) {
		return replace(value, trimRegex, '');
	};

	var ES5 = __webpack_require__(22);

	var hasRegExpMatcher = __webpack_require__(24);

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
	var ES6 = assign(assign({}, ES5), {

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
		Call: function Call(F, V) {
			var args = arguments.length > 2 ? arguments[2] : [];
			if (!this.IsCallable(F)) {
				throw new TypeError(F + ' is not a function');
			}
			return F.apply(V, args);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
		ToPrimitive: toPrimitive,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
		// ToBoolean: ES5.ToBoolean,

		// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
		ToNumber: function ToNumber(argument) {
			var value = isPrimitive(argument) ? argument : toPrimitive(argument, 'number');
			if (typeof value === 'symbol') {
				throw new TypeError('Cannot convert a Symbol value to a number');
			}
			if (typeof value === 'string') {
				if (isBinary(value)) {
					return this.ToNumber(parseInteger(strSlice(value, 2), 2));
				} else if (isOctal(value)) {
					return this.ToNumber(parseInteger(strSlice(value, 2), 8));
				} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
					return NaN;
				} else {
					var trimmed = trim(value);
					if (trimmed !== value) {
						return this.ToNumber(trimmed);
					}
				}
			}
			return Number(value);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
		// ToInteger: ES5.ToNumber,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
		// ToInt32: ES5.ToInt32,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
		// ToUint32: ES5.ToUint32,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
		ToInt16: function ToInt16(argument) {
			var int16bit = this.ToUint16(argument);
			return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
		// ToUint16: ES5.ToUint16,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
		ToInt8: function ToInt8(argument) {
			var int8bit = this.ToUint8(argument);
			return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
		ToUint8: function ToUint8(argument) {
			var number = this.ToNumber(argument);
			if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
			var posInt = sign(number) * Math.floor(Math.abs(number));
			return mod(posInt, 0x100);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
		ToUint8Clamp: function ToUint8Clamp(argument) {
			var number = this.ToNumber(argument);
			if ($isNaN(number) || number <= 0) { return 0; }
			if (number >= 0xFF) { return 0xFF; }
			var f = Math.floor(argument);
			if (f + 0.5 < number) { return f + 1; }
			if (number < f + 0.5) { return f; }
			if (f % 2 !== 0) { return f + 1; }
			return f;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
		ToString: function ToString(argument) {
			if (typeof argument === 'symbol') {
				throw new TypeError('Cannot convert a Symbol value to a string');
			}
			return String(argument);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
		ToObject: function ToObject(value) {
			this.RequireObjectCoercible(value);
			return Object(value);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
		ToPropertyKey: function ToPropertyKey(argument) {
			var key = this.ToPrimitive(argument, String);
			return typeof key === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
		ToLength: function ToLength(argument) {
			var len = this.ToInteger(argument);
			if (len <= 0) { return 0; } // includes converting -0 to +0
			if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
			return len;
		},

		// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
		CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
			if (toStr.call(argument) !== '[object String]') {
				throw new TypeError('must be a string');
			}
			if (argument === '-0') { return -0; }
			var n = this.ToNumber(argument);
			if (this.SameValue(this.ToString(n), argument)) { return n; }
			return void 0;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
		RequireObjectCoercible: ES5.CheckObjectCoercible,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
		IsArray: Array.isArray || function IsArray(argument) {
			return toStr.call(argument) === '[object Array]';
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
		// IsCallable: ES5.IsCallable,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
		IsConstructor: function IsConstructor(argument) {
			return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
		IsExtensible: function IsExtensible(obj) {
			if (!Object.preventExtensions) { return true; }
			if (isPrimitive(obj)) {
				return false;
			}
			return Object.isExtensible(obj);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
		IsInteger: function IsInteger(argument) {
			if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
				return false;
			}
			var abs = Math.abs(argument);
			return Math.floor(abs) === abs;
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
		IsPropertyKey: function IsPropertyKey(argument) {
			return typeof argument === 'string' || typeof argument === 'symbol';
		},

		// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
		IsRegExp: function IsRegExp(argument) {
			if (!argument || typeof argument !== 'object') {
				return false;
			}
			if (hasSymbols) {
				var isRegExp = argument[Symbol.match];
				if (typeof isRegExp !== 'undefined') {
					return ES5.ToBoolean(isRegExp);
				}
			}
			return hasRegExpMatcher(argument);
		},

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
		// SameValue: ES5.SameValue,

		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
		SameValueZero: function SameValueZero(x, y) {
			return (x === y) || ($isNaN(x) && $isNaN(y));
		},

		Type: function Type(x) {
			if (typeof x === 'symbol') {
				return 'Symbol';
			}
			return ES5.Type(x);
		},

		// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
		SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
			if (this.Type(O) !== 'Object') {
				throw new TypeError('Assertion failed: Type(O) is not Object');
			}
			var C = O.constructor;
			if (typeof C === 'undefined') {
				return defaultConstructor;
			}
			if (this.Type(C) !== 'Object') {
				throw new TypeError('O.constructor is not an Object');
			}
			var S = hasSymbols && Symbol.species ? C[Symbol.species] : undefined;
			if (S == null) {
				return defaultConstructor;
			}
			if (this.IsConstructor(S)) {
				return S;
			}
			throw new TypeError('no constructor found');
		}
	});

	delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

	module.exports = ES6;


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = Number.isNaN || function isNaN(a) {
		return a !== a;
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	var $isNaN = Number.isNaN || function (a) { return a !== a; };

	module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };


/***/ },
/* 11 */
/***/ function(module, exports) {

	var has = Object.prototype.hasOwnProperty;
	module.exports = Object.assign || function assign(target, source) {
		for (var key in source) {
			if (has.call(source, key)) {
				target[key] = source[key];
			}
		}
		return target;
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function sign(number) {
		return number >= 0 ? 1 : -1;
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function mod(number, modulo) {
		var remain = number % modulo;
		return Math.floor(remain >= 0 ? remain : remain + modulo);
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

	var isPrimitive = __webpack_require__(16);
	var isCallable = __webpack_require__(17);
	var isDate = __webpack_require__(18);
	var isSymbol = __webpack_require__(19);

	var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
		if (typeof O === 'undefined' || O === null) {
			throw new TypeError('Cannot call method on ' + O);
		}
		if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
			throw new TypeError('hint must be "string" or "number"');
		}
		var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
		var method, result, i;
		for (i = 0; i < methodNames.length; ++i) {
			method = O[methodNames[i]];
			if (isCallable(method)) {
				result = method.call(O);
				if (isPrimitive(result)) {
					return result;
				}
			}
		}
		throw new TypeError('No default value');
	};

	var GetMethod = function GetMethod(O, P) {
		var func = O[P];
		if (func !== null && typeof func !== 'undefined') {
			if (!isCallable(func)) {
				throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
			}
			return func;
		}
	};

	// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
	module.exports = function ToPrimitive(input, PreferredType) {
		if (isPrimitive(input)) {
			return input;
		}
		var hint = 'default';
		if (arguments.length > 1) {
			if (PreferredType === String) {
				hint = 'string';
			} else if (PreferredType === Number) {
				hint = 'number';
			}
		}

		var exoticToPrim;
		if (hasSymbols) {
			if (Symbol.toPrimitive) {
				exoticToPrim = GetMethod(input, Symbol.toPrimitive);
			} else if (isSymbol(input)) {
				exoticToPrim = Symbol.prototype.valueOf;
			}
		}
		if (typeof exoticToPrim !== 'undefined') {
			var result = exoticToPrim.call(input, hint);
			if (isPrimitive(result)) {
				return result;
			}
			throw new TypeError('unable to convert exotic object to primitive');
		}
		if (hint === 'default' && (isDate(input) || isSymbol(input))) {
			hint = 'string';
		}
		return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	var fnToStr = Function.prototype.toString;

	var constructorRegex = /^\s*class /;
	var isES6ClassFn = function isES6ClassFn(value) {
		try {
			var fnStr = fnToStr.call(value);
			var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
			var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
			var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
			return constructorRegex.test(spaceStripped);
		} catch (e) {
			return false; // not a function
		}
	};

	var tryFunctionObject = function tryFunctionObject(value) {
		try {
			if (isES6ClassFn(value)) { return false; }
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var fnClass = '[object Function]';
	var genClass = '[object GeneratorFunction]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	module.exports = function isCallable(value) {
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		return strClass === fnClass || strClass === genClass;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	var getDay = Date.prototype.getDay;
	var tryDateObject = function tryDateObject(value) {
		try {
			getDay.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};

	var toStr = Object.prototype.toString;
	var dateClass = '[object Date]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	module.exports = function isDateObject(value) {
		if (typeof value !== 'object' || value === null) { return false; }
		return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	var toStr = Object.prototype.toString;
	var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

	if (hasSymbols) {
		var symToStr = Symbol.prototype.toString;
		var symStringRegex = /^Symbol\(.*\)$/;
		var isSymbolObject = function isSymbolObject(value) {
			if (typeof value.valueOf() !== 'symbol') { return false; }
			return symStringRegex.test(symToStr.call(value));
		};
		module.exports = function isSymbol(value) {
			if (typeof value === 'symbol') { return true; }
			if (toStr.call(value) !== '[object Symbol]') { return false; }
			try {
				return isSymbolObject(value);
			} catch (e) {
				return false;
			}
		};
	} else {
		module.exports = function isSymbol(value) {
			// this environment does not support Symbols.
			return false;
		};
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var implementation = __webpack_require__(21);

	module.exports = Function.prototype.bind || implementation;


/***/ },
/* 21 */
/***/ function(module, exports) {

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice = Array.prototype.slice;
	var toStr = Object.prototype.toString;
	var funcType = '[object Function]';

	module.exports = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slice.call(arguments, 1);

	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                args.concat(slice.call(arguments))
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        } else {
	            return target.apply(
	                that,
	                args.concat(slice.call(arguments))
	            );
	        }
	    };

	    var boundLength = Math.max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs.push('$' + i);
	    }

	    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $isNaN = __webpack_require__(9);
	var $isFinite = __webpack_require__(10);

	var sign = __webpack_require__(12);
	var mod = __webpack_require__(13);

	var IsCallable = __webpack_require__(17);
	var toPrimitive = __webpack_require__(23);

	// https://es5.github.io/#x9
	var ES5 = {
		ToPrimitive: toPrimitive,

		ToBoolean: function ToBoolean(value) {
			return Boolean(value);
		},
		ToNumber: function ToNumber(value) {
			return Number(value);
		},
		ToInteger: function ToInteger(value) {
			var number = this.ToNumber(value);
			if ($isNaN(number)) { return 0; }
			if (number === 0 || !$isFinite(number)) { return number; }
			return sign(number) * Math.floor(Math.abs(number));
		},
		ToInt32: function ToInt32(x) {
			return this.ToNumber(x) >> 0;
		},
		ToUint32: function ToUint32(x) {
			return this.ToNumber(x) >>> 0;
		},
		ToUint16: function ToUint16(value) {
			var number = this.ToNumber(value);
			if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
			var posInt = sign(number) * Math.floor(Math.abs(number));
			return mod(posInt, 0x10000);
		},
		ToString: function ToString(value) {
			return String(value);
		},
		ToObject: function ToObject(value) {
			this.CheckObjectCoercible(value);
			return Object(value);
		},
		CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
			/* jshint eqnull:true */
			if (value == null) {
				throw new TypeError(optMessage || 'Cannot call method on ' + value);
			}
			return value;
		},
		IsCallable: IsCallable,
		SameValue: function SameValue(x, y) {
			if (x === y) { // 0 === -0, but they are not identical.
				if (x === 0) { return 1 / x === 1 / y; }
				return true;
			}
			return $isNaN(x) && $isNaN(y);
		},

		// http://www.ecma-international.org/ecma-262/5.1/#sec-8
		Type: function Type(x) {
			if (x === null) {
				return 'Null';
			}
			if (typeof x === 'undefined') {
				return 'Undefined';
			}
			if (typeof x === 'function' || typeof x === 'object') {
				return 'Object';
			}
			if (typeof x === 'number') {
				return 'Number';
			}
			if (typeof x === 'boolean') {
				return 'Boolean';
			}
			if (typeof x === 'string') {
				return 'String';
			}
		}
	};

	module.exports = ES5;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toStr = Object.prototype.toString;

	var isPrimitive = __webpack_require__(16);

	var isCallable = __webpack_require__(17);

	// https://es5.github.io/#x8.12
	var ES5internalSlots = {
		'[[DefaultValue]]': function (O, hint) {
			var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

			if (actualHint === String || actualHint === Number) {
				var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
				var value, i;
				for (i = 0; i < methods.length; ++i) {
					if (isCallable(O[methods[i]])) {
						value = O[methods[i]]();
						if (isPrimitive(value)) {
							return value;
						}
					}
				}
				throw new TypeError('No default value');
			}
			throw new TypeError('invalid [[DefaultValue]] hint supplied');
		}
	};

	// https://es5.github.io/#x9
	module.exports = function ToPrimitive(input, PreferredType) {
		if (isPrimitive(input)) {
			return input;
		}
		return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	var regexExec = RegExp.prototype.exec;
	var tryRegexExec = function tryRegexExec(value) {
		try {
			regexExec.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var regexClass = '[object RegExp]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

	module.exports = function isRegex(value) {
		if (typeof value !== 'object') { return false; }
		return hasToStringTag ? tryRegexExec(value) : toStr.call(value) === regexClass;
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var bind = __webpack_require__(20);

	module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var implementation = __webpack_require__(6);

	module.exports = function getPolyfill() {
		return typeof Object.values === 'function' ? Object.values : implementation;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getPolyfill = __webpack_require__(26);
	var define = __webpack_require__(2);

	module.exports = function shimValues() {
		var polyfill = getPolyfill();
		define(Object, { values: polyfill }, { values: function () { return Object.values !== polyfill; } });
		return polyfill;
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * The Remington module
	 * @module remington
	 */

	var keycodes = __webpack_require__(29);
	var constants = __webpack_require__(30);

	/**
	 * The Remington constructor
	 * @constructor
	 * @param {Element} [element] - The DOM element to which to attach this Remington instance. If undefined, no event listeners will be registered
	 * and the buffer can only be mutated using the Remington instance methods
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

	    /**
	     * Gets the cursor position
	     */
	    self.getCursor = function () {
	        return cursor;
	    };

	    /**
	     * Set the cursor position
	     * If the new position is out of bounds, it will be set to the nearest valid position
	     * @property {Number} col - The column to set the cursor to
	     * @property {Number} row - The row to set the cursor to
	     */
	    self.setCursor = function (col, row) {
	        if (row < 0) {
	            row = 0;
	        } else if (row > buffer.rows.length - 1) {
	            row = buffer.rows.length - 1;
	        }

	        if (col < 0) {
	            col = 0;
	        } else if (col > buffer.rows[row].length - 1) {
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
	     * Sends a single character to the buffer and updates the cursor accordingly
	     * @private
	     * @param {String} character - the character to send to the buffer
	     * @returns true to maintain compatibility with sendInput()
	     */
	    var handleCharacterInput = function handleCharacterInput(character) {
	        if (!buffer.rows[cursor.row]) {
	            buffer.rows[cursor.row] = "";
	        }
	        buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col, 0, character);
	        cursor.col++;
	        return true;
	    };

	    /**
	     * Sends a non-character input (backspace, enter) to the buffer
	     * @param {Number} keycode - the keycode of the key to send
	     * @returns true if keycode is a valid key (one the Remington knows how to handle), false otherwise
	     */
	    var handleNonCharacterInput = function handleNonCharacterInput(keycode) {
	        var validKey = true;
	        switch (keycode) {
	            case keycodes.SPACE:
	                {
	                    if (!buffer.rows[cursor.row]) {
	                        buffer.rows[cursor.row] = "";
	                    }
	                    buffer.rows[cursor.row] = buffer.rows[cursor.row].splice(cursor.col, 0, constants.SPACE);
	                    cursor.col++;
	                    break;
	                }
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
	                    // if the cursor is at the beginning of a row, go the former end of the previous row
	                    if (cursor.col === 0 && cursor.row > 0) {
	                        // concatenate the current row with the previous one
	                        // and delete the newline at the end of the previous one
	                        var previousRowLength = buffer.rows[cursor.row - 1].length;
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
	            default:
	                {
	                    validKey = false;
	                    break;
	                }
	        }
	        return validKey;
	    };

	    /**
	     * Sends input to the buffer
	     * @param {String|Number} input - a keycode or character value to send to the buffer
	     * @returns true if the Remington instance knew how to handle the input, false if otherwise
	     */
	    self.sendInput = function (input) {
	        if (typeof input === "string") {
	            if (input.length != 1) {
	                throw new Error("Input must be processed one character at a time");
	            }
	            return handleCharacterInput(input);
	        } else if (typeof input === "number") {
	            // If the input is a keycode that Remington knows about, handle it
	            if (Object.values(keycodes).indexOf(input) >= 0) {
	                return handleNonCharacterInput(input);
	            }
	            // Otherwise, assume the input is a charCode representing a character
	            else {
	                    var character = String.fromCharCode(input);
	                    return handleCharacterInput(character);
	                }
	        }
	    };

	    // Only register event listeners if an element is defined
	    if (element) {

	        /**
	         * The keypress event listener handles inserting regular characters
	         */
	        element.addEventListener('keypress', function (event) {
	            // Catch any keypress events that should be handled as non-character keys
	            if (Object.values(keycodes).indexOf(event.keyCode) >= 0) {
	                return;
	            }
	            var character = String.fromCharCode(event.charCode);
	            handleCharacterInput(character);
	            if (inputCallback && typeof inputCallback === 'function') {
	                inputCallback(event);
	            }
	        });

	        /**
	         * The keydown event listener handles non-character keys such as ENTER
	         */
	        element.addEventListener('keydown', function (event) {
	            var validKey = handleNonCharacterInput(event.keyCode);
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
	};

	module.exports = Remington;

/***/ },
/* 29 */
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
	    "ALT": 18,
	    "SPACE": 32
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    "NEWLINE": '\n',
	    "SPACE": ' '
	};

/***/ }
/******/ ]);