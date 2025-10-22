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
exports.clearStringMeasurementCache = clearStringMeasurementCache;
exports.getStyleString = getStyleString;
exports.measureText = measureText;
exports.measureTextBatch = measureTextBatch;
var isSsr = typeof window === 'undefined';
var stringCache = new Map();
var canvasSupportsLetterSpacing = null;
var measurementCanvas = null;
var measurementContext = null;
var measurementContainer = null;
function clearStringMeasurementCache() {
    stringCache.clear();
    // Reset letterSpacing support detection to force re-check
    canvasSupportsLetterSpacing = null;
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
    'letterSpacing',
]);
/**
 * Convert number value to pixel value for a custom set of CSS properties
 */
function convertPixelValue(name, value) {
    if (PIXEL_STYLES.has(name)) {
        return addPixelToValueIfNeeded(value);
    }
    return value;
}
function addPixelToValueIfNeeded(value) {
    if (typeof value === 'number') {
        return value + 'px'; // eslint-disable-line
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
function measureText(text, style) {
    if (style === void 0) { style = {}; }
    if (text === undefined || text === null || isSsr) {
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
        // Check if we should use canvas-based measurement
        var useCanvas = checkLetterSpacingSupport();
        var result = void 0;
        if (useCanvas) {
            result = measureTextWithCanvas(str, style);
        }
        else {
            // Fall back to SVG-based measurement
            var measurementSpanContainer = getMeasurementContainer();
            var measurementElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
            // https://en.wikipedia.org/wiki/Content_Security_Policy
            for (var _i = 0, _a = Object.keys(style); _i < _a.length; _i++) {
                var styleKey = _a[_i];
                measurementElem.style[camelCaseToDashCase(styleKey)] =
                    convertPixelValue(styleKey, style[styleKey]);
            }
            measurementElem.textContent = str;
            measurementSpanContainer.replaceChildren(measurementElem);
            var rect = measurementElem.getBoundingClientRect();
            result = { width: rect.width, height: rect.height };
            if (process.env.NODE_ENV === 'test') {
                // In test environment, we clean the measurement span immediately
                measurementSpanContainer.replaceChildren();
            }
        }
        stringCache.set(cacheKey, result);
        if (stringCache.size + 1 > MAX_CACHE_NUM) {
            stringCache.clear();
        }
        return result;
    }
    catch (_b) {
        return { width: 0, height: 0 };
    }
}
function measureTextBatch(texts, style) {
    if (style === void 0) { style = {}; }
    if (isSsr) {
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
    if (textToMeasure.length === 0) {
        return sizeMap;
    }
    // Check if we should use canvas-based measurement
    var useCanvas = checkLetterSpacingSupport();
    if (useCanvas) {
        // Use canvas for batch measurement
        for (var _a = 0, textToMeasure_1 = textToMeasure; _a < textToMeasure_1.length; _a++) {
            var text = textToMeasure_1[_a];
            var result = measureTextWithCanvas(String(text), style);
            var cacheKey = "".concat(text, "-").concat(styleString);
            stringCache.set(cacheKey, result);
            sizeMap.set(text, result);
        }
    }
    else {
        // Fall back to SVG-based batch measurement
        var measurementContainer_1 = getMeasurementContainer();
        // Need to use CSS Object Model (CSSOM) to be able to comply with Content Security Policy (CSP)
        // https://en.wikipedia.org/wiki/Content_Security_Policy
        var measurementSpanStyle = __assign({}, style);
        for (var _b = 0, _c = Object.keys(measurementSpanStyle); _b < _c.length; _b++) {
            var styleKey = _c[_b];
            measurementContainer_1.style[camelCaseToDashCase(styleKey)] =
                convertPixelValue(styleKey, measurementSpanStyle[styleKey]);
        }
        var measurementElems = [];
        for (var _d = 0, textToMeasure_2 = textToMeasure; _d < textToMeasure_2.length; _d++) {
            var string = textToMeasure_2[_d];
            var measurementElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            measurementElem.textContent = "".concat(string);
            measurementElems.push(measurementElem);
        }
        measurementContainer_1.replaceChildren.apply(measurementContainer_1, measurementElems);
        for (var i = 0; i < textToMeasure.length; i += 1) {
            var text = textToMeasure[i];
            var measurementSpan = measurementContainer_1.children[i];
            var rect = measurementSpan.getBoundingClientRect();
            var result = { width: rect.width, height: rect.height };
            var cacheKey = "".concat(text, "-").concat(styleString);
            stringCache.set(cacheKey, result);
            sizeMap.set(text, result);
        }
        if (process.env.NODE_ENV === 'test') {
            // In test environment, we clean the measurement span immediately
            measurementContainer_1.replaceChildren();
        }
    }
    if (stringCache.size + 1 > MAX_CACHE_NUM) {
        stringCache.clear();
    }
    return sizeMap;
}
function measureTextWithCanvas(text, style) {
    var ctx = getCanvasContext();
    // Build font string from style
    var fontSize = style.fontSize ? addPixelToValueIfNeeded(style.fontSize) : '16px';
    var fontFamily = style.fontFamily || 'sans-serif';
    var fontWeight = style.fontWeight || 'normal';
    var fontStyle = style.fontStyle || 'normal';
    ctx.font = "".concat(fontStyle, " ").concat(fontWeight, " ").concat(fontSize, " ").concat(fontFamily);
    // Apply additional text layout properties
    ctx.letterSpacing = style.letterSpacing
        ? addPixelToValueIfNeeded(style.letterSpacing)
        : '0px';
    // Apply textAlign if specified
    if (style.textAlign) {
        ctx.textAlign = style.textAlign;
    }
    // Apply textBaseline if specified (mapped from verticalAlign or explicit textBaseline)
    var textBaseline = style.textBaseline;
    if (textBaseline) {
        ctx.textBaseline = textBaseline;
    }
    // Apply direction if specified
    if (style.direction) {
        ctx.direction = style.direction;
    }
    // Apply fontKerning if specified
    var fontKerning = style.fontKerning;
    if (fontKerning) {
        ctx.fontKerning = fontKerning;
    }
    // Apply fontStretch if specified
    var fontStretch = style.fontStretch;
    if (fontStretch) {
        ctx.fontStretch = fontStretch;
    }
    // Apply fontVariantCaps if specified
    var fontVariantCaps = style.fontVariantCaps;
    if (fontVariantCaps) {
        ctx.fontVariantCaps = fontVariantCaps;
    }
    var metrics = ctx.measureText(text);
    return {
        width: metrics.width,
        height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    };
}
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
function getCanvasContext() {
    if (measurementContext === null) {
        measurementCanvas = document.createElement('canvas');
        measurementContext = measurementCanvas.getContext('2d');
        if (measurementContext === null) {
            throw new Error('Canvas context not available');
        }
    }
    return measurementContext;
}
function checkLetterSpacingSupport() {
    if (canvasSupportsLetterSpacing !== null) {
        return canvasSupportsLetterSpacing;
    }
    try {
        var ctx = getCanvasContext();
        if (!ctx) {
            canvasSupportsLetterSpacing = false;
            return false;
        }
        // Test if letterSpacing property is supported
        var testText = 'test';
        var testStyle = { fontSize: 16, letterSpacing: '5px' };
        // Apply styles
        ctx.font = "".concat(testStyle.fontSize, "px sans-serif");
        var widthWithoutLetterSpacing = ctx.measureText(testText).width;
        // Try to apply letterSpacing
        ctx.letterSpacing = testStyle.letterSpacing;
        var widthWithLetterSpacing = ctx.measureText(testText).width;
        // If letterSpacing is supported, the widths should be different
        // We expect approximately 15px difference (3 letter spacings * 5px)
        var hasSupport = widthWithLetterSpacing > widthWithoutLetterSpacing;
        canvasSupportsLetterSpacing = hasSupport;
        return hasSupport;
    }
    catch (error) {
        // Silently catch errors (e.g., canvas not supported in jsdom)
        canvasSupportsLetterSpacing = false;
        return false;
    }
}
