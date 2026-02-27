"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greenPalette = exports.greenPaletteDark = exports.greenPaletteLight = void 0;
exports.greenPaletteLight = [
    '#CDEBDD',
    '#B2E2CB',
    '#8FD8B5',
    '#54C690',
    '#31B375',
    '#359F6D',
    '#0F7746',
    '#065731',
];
exports.greenPaletteDark = exports.greenPaletteLight;
var greenPalette = function (mode) {
    return mode === 'dark' ? exports.greenPaletteDark : exports.greenPaletteLight;
};
exports.greenPalette = greenPalette;
