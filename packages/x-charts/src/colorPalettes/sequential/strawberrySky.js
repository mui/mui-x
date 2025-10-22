"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strawberrySkyPalette = exports.strawberrySkyPaletteDark = exports.strawberrySkyPaletteLight = void 0;
exports.strawberrySkyPaletteLight = [
    '#6877FF',
    '#694FFD',
    '#A94FFD',
    '#DA4FFD',
    '#F050A5',
    '#FF5E6C',
];
exports.strawberrySkyPaletteDark = exports.strawberrySkyPaletteLight;
var strawberrySkyPalette = function (mode) {
    return mode === 'dark' ? exports.strawberrySkyPaletteDark : exports.strawberrySkyPaletteLight;
};
exports.strawberrySkyPalette = strawberrySkyPalette;
