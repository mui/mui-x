"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cheerfulFiestaPalette = exports.cheerfulFiestaPaletteLight = exports.cheerfulFiestaPaletteDark = void 0;
exports.cheerfulFiestaPaletteDark = [
    '#0059B2',
    '#2E96FF',
    '#FFC24C',
    '#FF9F0E',
    '#F38200',
    '#2ABFDE',
    '#1F94AD',
    '#BD2C38',
    '#FF3143',
    '#FF8282',
];
exports.cheerfulFiestaPaletteLight = [
    '#003A75',
    '#007FFF',
    '#FFC24C',
    '#FF9D09',
    '#CA6C00',
    '#127D94',
    '#1F94AD',
    '#C82634',
    '#FF3143',
    '#FF7E7E',
];
var cheerfulFiestaPalette = function (mode) {
    return mode === 'dark' ? exports.cheerfulFiestaPaletteDark : exports.cheerfulFiestaPaletteLight;
};
exports.cheerfulFiestaPalette = cheerfulFiestaPalette;
