"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cyanPalette = exports.cyanPaletteDark = exports.cyanPaletteLight = void 0;
exports.cyanPaletteLight = [
    '#CFE9E8',
    '#A3DAD8',
    '#7ED0CE',
    '#44BDBA',
    '#299896',
    '#137370',
    '#0E5A58',
    '#073938',
];
exports.cyanPaletteDark = exports.cyanPaletteLight;
var cyanPalette = function (mode) {
    return mode === 'dark' ? exports.cyanPaletteDark : exports.cyanPaletteLight;
};
exports.cyanPalette = cyanPalette;
