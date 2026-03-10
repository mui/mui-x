"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinkPalette = exports.pinkPaletteDark = exports.pinkPaletteLight = void 0;
exports.pinkPaletteLight = [
    '#F7D2E1',
    '#F6BED5',
    '#F4A0C3',
    '#F6619F',
    '#EE448B',
    '#E32977',
    '#B6215F',
    '#8B1F4C',
];
exports.pinkPaletteDark = exports.pinkPaletteLight;
var pinkPalette = function (mode) {
    return mode === 'dark' ? exports.pinkPaletteDark : exports.pinkPaletteLight;
};
exports.pinkPalette = pinkPalette;
