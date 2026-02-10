"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mangoFusionPalette = exports.mangoFusionPaletteDark = exports.mangoFusionPaletteLight = void 0;
exports.mangoFusionPaletteLight = [
    '#173A5E',
    '#00A3A0',
    '#C91B63',
    '#EF5350',
    '#FFA726',
    '#B800D8',
    '#60009B',
    '#2E96FF',
    '#2731C8',
    '#03008D',
];
exports.mangoFusionPaletteDark = [
    '#41698F',
    '#19D0CD',
    '#DE196B',
    '#FC5F5C',
    '#FFD771',
    '#DA00FF',
    '#9001CB',
    '#72CCFF',
    '#2E96FF',
    '#3B48E0',
];
var mangoFusionPalette = function (mode) {
    return mode === 'dark' ? exports.mangoFusionPaletteDark : exports.mangoFusionPaletteLight;
};
exports.mangoFusionPalette = mangoFusionPalette;
