"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blueberryTwilightPalette = exports.blueberryTwilightPaletteDark = exports.blueberryTwilightPaletteLight = void 0;
exports.blueberryTwilightPaletteLight = [
    '#02B2AF',
    '#2E96FF',
    '#B800D8',
    '#60009B',
    '#2731C8',
    '#03008D',
];
exports.blueberryTwilightPaletteDark = [
    '#02B2AF',
    '#72CCFF',
    '#DA00FF',
    '#9001CB',
    '#2E96FF',
    '#3B48E0',
];
var blueberryTwilightPalette = function (mode) {
    return mode === 'dark' ? exports.blueberryTwilightPaletteDark : exports.blueberryTwilightPaletteLight;
};
exports.blueberryTwilightPalette = blueberryTwilightPalette;
