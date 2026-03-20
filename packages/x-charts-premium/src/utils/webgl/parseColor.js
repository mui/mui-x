"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseColor = parseColor;
var colorCache = new Map();
/**
 * Parse color string to RGBA object. Each channel is normalized to [0, 1].
 * This function does not work in SSR.
 */
function parseColor(color) {
    var cached = colorCache.get(color);
    if (cached) {
        return cached;
    }
    var result = parseColorUsingRegex(color);
    if (result == null) {
        result = parseRgbaColor(color);
    }
    if (result == null) {
        result = parseColorUsingCanvas(color);
    }
    colorCache.set(color, result);
    return result;
}
// Validates hex color formats (#RGB, #RRGGBB, #RRGGBBAA)
var hexRegex = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/;
function parseColorUsingRegex(color) {
    if (color.startsWith('#')) {
        color = color.slice(1);
    }
    if (!hexRegex.test(color)) {
        return null; // Invalid hex color
    }
    if (color.length === 3) {
        color = color
            .split('')
            .map(function (char) { return char + char; })
            .join('');
    }
    var r = parseInt(color.slice(0, 2), 16) / 255;
    var g = parseInt(color.slice(2, 4), 16) / 255;
    var b = parseInt(color.slice(4, 6), 16) / 255;
    var a = color.length === 8 ? parseInt(color.substring(6, 8), 16) / 255 : 1;
    return [r, g, b, a];
}
// Parses rgb() and rgba() formats
var rgbaRegex = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;
function parseRgbaColor(color) {
    var match = color.match(rgbaRegex);
    if (!match) {
        return null;
    }
    var r = parseInt(match[1], 10);
    var g = parseInt(match[2], 10);
    var b = parseInt(match[3], 10);
    var a = match[4] !== undefined ? parseFloat(match[4]) : 1;
    if (r > 255 || g > 255 || b > 255) {
        return null;
    }
    if (a < 0 || a > 1) {
        return null;
    }
    return [r / 255, g / 255, b / 255, a];
}
var canvas;
function parseColorUsingCanvas(color) {
    if (!canvas) {
        if ('OffscreenCanvas' in window) {
            canvas = new OffscreenCanvas(1, 1);
        }
        else {
            canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
        }
    }
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var _a = ctx.getImageData(0, 0, 1, 1).data, r = _a[0], g = _a[1], b = _a[2], a = _a[3];
    var result = [r / 255, g / 255, b / 255, a / 255];
    return result;
}
