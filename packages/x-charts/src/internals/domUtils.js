"use strict";
// DOM utils taken from
// https://github.com/recharts/recharts/blob/master/src/util/DOMUtils.ts
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringSize = exports.getStyleString = exports.MEASUREMENT_SPAN_ID = void 0;
function isSsr() {
    return typeof window === 'undefined';
}
var stringCache = new Map();
var MAX_CACHE_NUM = 2000;
var SPAN_STYLE = {
    position: 'absolute',
    top: '-20000px',
    left: 0,
    padding: 0,
    margin: 0,
    border: 'none',
    whiteSpace: 'pre',
};
var STYLE_LIST = [
    'minWidth',
    'maxWidth',
    'width',
    'minHeight',
    'maxHeight',
    'height',
    'top',
    'left',
    'fontSize',
    'padding',
    'margin',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
];
exports.MEASUREMENT_SPAN_ID = 'mui_measurement_span';
/**
 *
 * @param name CSS property name
 * @param value
 * @returns add 'px' for distance properties
 */
function autoCompleteStyle(name, value) {
    if (STYLE_LIST.indexOf(name) >= 0 && value === +value) {
        return "".concat(value, "px");
    }
    return value;
}
/**
 *
 * @param text camelcase css property
 * @returns css property
 */
function camelToMiddleLine(text) {
    var strs = text.split('');
    var formatStrs = strs.reduce(function (result, entry) {
        if (entry === entry.toUpperCase()) {
            return __spreadArray(__spreadArray([], result, true), ['-', entry.toLowerCase()], false);
        }
        return __spreadArray(__spreadArray([], result, true), [entry], false);
    }, []);
    return formatStrs.join('');
}
/**
 *
 * @param style React style object
 * @returns CSS styling string
 */
var getStyleString = function (style) {
    return Object.keys(style)
        .sort()
        .reduce(function (result, s) {
        return "".concat(result).concat(camelToMiddleLine(s), ":").concat(autoCompleteStyle(s, style[s]), ";");
    }, '');
};
exports.getStyleString = getStyleString;
var domCleanTimeout;
/**
 *
 * @param text The string to estimate
 * @param style The style applied
 * @returns width and height of the text
 */
var getStringSize = function (text, style) {
    if (style === void 0) { style = {}; }
    if (text === undefined || text === null || isSsr()) {
        return { width: 0, height: 0 };
    }
    var str = "".concat(text);
    var styleString = (0, exports.getStyleString)(style);
    var cacheKey = "".concat(str, "-").concat(styleString);
    var size = stringCache.get(cacheKey);
    if (size) {
        return size;
    }
    try {
        var measurementSpan_1 = document.getElementById(exports.MEASUREMENT_SPAN_ID);
        if (measurementSpan_1 === null) {
            measurementSpan_1 = document.createElement('span');
            measurementSpan_1.setAttribute('id', exports.MEASUREMENT_SPAN_ID);
            measurementSpan_1.setAttribute('aria-hidden', 'true');
            document.body.appendChild(measurementSpan_1);
        }
        // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
        // https://en.wikipedia.org/wiki/Content_Security_Policy
        var measurementSpanStyle_1 = __assign(__assign({}, SPAN_STYLE), style);
        Object.keys(measurementSpanStyle_1).map(function (styleKey) {
            measurementSpan_1.style[camelToMiddleLine(styleKey)] =
                autoCompleteStyle(styleKey, measurementSpanStyle_1[styleKey]);
            return styleKey;
        });
        measurementSpan_1.textContent = str;
        var rect = measurementSpan_1.getBoundingClientRect();
        var result = { width: rect.width, height: rect.height };
        stringCache.set(cacheKey, result);
        if (stringCache.size + 1 > MAX_CACHE_NUM) {
            stringCache.clear();
        }
        if (process.env.NODE_ENV === 'test') {
            // In test environment, we clean the measurement span immediately
            measurementSpan_1.textContent = '';
        }
        else {
            if (domCleanTimeout) {
                clearTimeout(domCleanTimeout);
            }
            domCleanTimeout = setTimeout(function () {
                // Limit node cleaning to once per render cycle
                measurementSpan_1.textContent = '';
            }, 0);
        }
        return result;
    }
    catch (_a) {
        return { width: 0, height: 0 };
    }
};
exports.getStringSize = getStringSize;
