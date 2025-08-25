"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yellowPalette = exports.yellowPaletteDark = exports.yellowPaletteLight = void 0;
exports.yellowPaletteLight = [
    '#FBEFD6',
    '#F5DEB0',
    '#F3CD80',
    '#FAC14F',
    '#FFB219',
    '#EF9801',
    '#DA7D0B',
    '#AB6208',
];
exports.yellowPaletteDark = exports.yellowPaletteLight;
var yellowPalette = function (mode) {
    return mode === 'dark' ? exports.yellowPaletteDark : exports.yellowPaletteLight;
};
exports.yellowPalette = yellowPalette;
