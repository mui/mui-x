"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringSize = void 0;
exports.clearStringMeasurementCache = clearStringMeasurementCache;
exports.getStyleString = getStyleString;
exports.batchMeasureStrings = batchMeasureStrings;
function isSsr() {
    return typeof window === 'undefined';
}
var stringCache = new Map();
function clearStringMeasurementCache() {
    stringCache.clear();
}
var MAX_CACHE_NUM = 2000;
var PIXEL_STYLES = new Set([
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
]);
/**
 * Convert number value to pixel value for certain CSS properties
 * @param name CSS property name
 * @param value
 * @returns add 'px' for distance properties
 */
function convertPixelValue(name, value) {
    if (PIXEL_STYLES.has(name) && value === +value) {
        return "".concat(value, "px");
    }
    return value;
}
/**
 * Converts camelcase to dash-case
 * @param text camelcase css property
 */
var AZ = /([A-Z])/g;
function camelCaseToDashCase(text) {
    return String(text).replace(AZ, function (match) { return "-".concat(match.toLowerCase()); });
}
/**
 * Converts a style object into a string to be used as a cache key
 * @param style React style object
 * @returns CSS styling string
 */
function getStyleString(style) {
    var result = '';
    for (var key in style) {
        if (Object.hasOwn(style, key)) {
            var k = key;
            var value = style[k];
            if (value === undefined) {
                continue;
            }
            result += "".concat(camelCaseToDashCase(k), ":").concat(convertPixelValue(k, value), ";");
        }
    }
    return result;
}
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
    var str = String(text);
    var styleString = getStyleString(style);
    var cacheKey = "".concat(str, "-").concat(styleString);
    var size = stringCache.get(cacheKey);
    if (size) {
        return size;
    }
    try {
        var measurementSpanContainer = getMeasurementContainer();
        var measurementElem_1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
        // https://en.wikipedia.org/wiki/Content_Security_Policy
        Object.keys(style).map(function (styleKey) {
            measurementElem_1.style[camelCaseToDashCase(styleKey)] =
                convertPixelValue(styleKey, style[styleKey]);
            return styleKey;
        });
        measurementElem_1.textContent = str;
        measurementSpanContainer.replaceChildren(measurementElem_1);
        var result = measureSVGTextElement(measurementElem_1);
        stringCache.set(cacheKey, result);
        if (stringCache.size + 1 > MAX_CACHE_NUM) {
            stringCache.clear();
        }
        if (process.env.NODE_ENV === 'test') {
            // In test environment, we clean the measurement span immediately
            measurementSpanContainer.replaceChildren();
        }
        return result;
    }
    catch (_a) {
        return { width: 0, height: 0 };
    }
};
exports.getStringSize = getStringSize;
function batchMeasureStrings(texts, style) {
    if (style === void 0) { style = {}; }
    if (isSsr()) {
        return new Map(Array.from(texts).map(function (text) { return [text, { width: 0, height: 0 }]; }));
    }
    var sizeMap = new Map();
    var textToMeasure = [];
    var styleString = getStyleString(style);
    for (var _i = 0, texts_1 = texts; _i < texts_1.length; _i++) {
        var text = texts_1[_i];
        var cacheKey = "".concat(text, "-").concat(styleString);
        var size = stringCache.get(cacheKey);
        if (size) {
            sizeMap.set(text, size);
        }
        else {
            textToMeasure.push(text);
        }
    }
    var measurementContainer = getMeasurementContainer();
    // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
    // https://en.wikipedia.org/wiki/Content_Security_Policy
    var measurementSpanStyle = __assign({}, style);
    Object.keys(measurementSpanStyle).map(function (styleKey) {
        measurementContainer.style[camelCaseToDashCase(styleKey)] =
            convertPixelValue(styleKey, measurementSpanStyle[styleKey]);
        return styleKey;
    });
    var measurementElements = [];
    for (var _a = 0, textToMeasure_1 = textToMeasure; _a < textToMeasure_1.length; _a++) {
        var string = textToMeasure_1[_a];
        var measurementElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        measurementElem.textContent = "".concat(string);
        measurementElements.push(measurementElem);
    }
    measurementContainer.replaceChildren.apply(measurementContainer, measurementElements);
    for (var i = 0; i < textToMeasure.length; i += 1) {
        var text = textToMeasure[i];
        var measurementElem = measurementContainer.children[i];
        var result = measureSVGTextElement(measurementElem);
        var cacheKey = "".concat(text, "-").concat(styleString);
        stringCache.set(cacheKey, result);
        sizeMap.set(text, result);
    }
    if (stringCache.size + 1 > MAX_CACHE_NUM) {
        stringCache.clear();
    }
    if (process.env.NODE_ENV === 'test') {
        // In test environment, we clean the measurement span immediately
        measurementContainer.replaceChildren();
    }
    return sizeMap;
}
/**
 * Measures an SVG text element using getBBox() with fallback to getBoundingClientRect()
 * @param element SVG text element to measure
 * @returns width and height of the text element
 */
function measureSVGTextElement(element) {
    // getBBox() is more reliable across browsers for SVG elements
    try {
        var result = element.getBBox();
        return { width: result.width, height: result.height };
    }
    catch (_a) {
        // Fallback to getBoundingClientRect if getBBox fails
        // This can happen in tests
        var result = element.getBoundingClientRect();
        return { width: result.width, height: result.height };
    }
}
var measurementContainer = null;
/**
 * Get (or create) a hidden span element to measure text size.
 */
function getMeasurementContainer() {
    if (measurementContainer === null) {
        measurementContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        measurementContainer.setAttribute('aria-hidden', 'true');
        measurementContainer.style.position = 'absolute';
        measurementContainer.style.top = '-20000px';
        measurementContainer.style.left = '0';
        measurementContainer.style.padding = '0';
        measurementContainer.style.margin = '0';
        measurementContainer.style.border = 'none';
        measurementContainer.style.pointerEvents = 'none';
        measurementContainer.style.visibility = 'hidden';
        measurementContainer.style.contain = 'strict';
        document.body.appendChild(measurementContainer);
    }
    return measurementContainer;
}
