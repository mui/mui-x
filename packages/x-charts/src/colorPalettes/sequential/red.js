"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redPalette = exports.redPaletteDark = exports.redPaletteLight = void 0;
exports.redPaletteLight = [
    '#FAE0E0',
    '#F7C0BF',
    '#F3A2A0',
    '#EF5350',
    '#E53935',
    '#DC2B27',
    '#860B08',
    '#560503 ',
];
exports.redPaletteDark = exports.redPaletteLight;
var redPalette = function (mode) {
    return mode === 'dark' ? exports.redPaletteDark : exports.redPaletteLight;
};
exports.redPalette = redPalette;
