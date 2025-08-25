"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rainbowSurgePalette = exports.rainbowSurgePaletteDark = exports.rainbowSurgePaletteLight = void 0;
exports.rainbowSurgePaletteLight = [
    '#4254FB',
    '#FFB422',
    '#FA4F58',
    '#0DBEFF',
    '#22BF75',
    '#FA83B4',
    '#FF7511',
];
exports.rainbowSurgePaletteDark = [
    '#495AFB',
    '#FFC758',
    '#F35865',
    '#30C8FF',
    '#44CE8D',
    '#F286B3',
    '#FF8C39',
];
var rainbowSurgePalette = function (mode) {
    return mode === 'dark' ? exports.rainbowSurgePaletteDark : exports.rainbowSurgePaletteLight;
};
exports.rainbowSurgePalette = rainbowSurgePalette;
