"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orangePalette = exports.orangePaletteDark = exports.orangePaletteLight = void 0;
exports.orangePaletteLight = [
    '#FBDBC3',
    '#F9BD92',
    '#F99F5D',
    '#FF7A19',
    '#FD620B',
    '#E15100',
    '#AC3E00',
    '#822F00',
];
exports.orangePaletteDark = exports.orangePaletteLight;
var orangePalette = function (mode) {
    return mode === 'dark' ? exports.orangePaletteDark : exports.orangePaletteLight;
};
exports.orangePalette = orangePalette;
