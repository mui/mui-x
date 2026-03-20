"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bluePalette = exports.bluePaletteDark = exports.bluePaletteLight = void 0;
exports.bluePaletteLight = [
    '#BDDEFF',
    '#99CCFF',
    '#66B2FF',
    '#2E96FF',
    '#0064D6',
    '#0D47A1',
    '#0A367B',
    '#072555',
];
exports.bluePaletteDark = exports.bluePaletteLight;
var bluePalette = function (mode) {
    return mode === 'dark' ? exports.bluePaletteDark : exports.bluePaletteLight;
};
exports.bluePalette = bluePalette;
