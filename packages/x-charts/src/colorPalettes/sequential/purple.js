"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purplePalette = exports.purplePaletteDark = exports.purplePaletteLight = void 0;
exports.purplePaletteLight = [
    '#CAD4EE',
    '#98ADE5',
    '#577EE3',
    '#4254FB',
    '#2638DF',
    '#222FA6',
    '#111C7F',
    '#091159',
];
exports.purplePaletteDark = exports.purplePaletteLight;
var purplePalette = function (mode) {
    return mode === 'dark' ? exports.purplePaletteDark : exports.purplePaletteLight;
};
exports.purplePalette = purplePalette;
