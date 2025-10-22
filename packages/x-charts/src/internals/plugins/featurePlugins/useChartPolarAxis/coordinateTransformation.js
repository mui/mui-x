"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePolar2svg = exports.generateSvg2polar = exports.generateSvg2rotation = void 0;
var generateSvg2rotation = function (center) { return function (x, y) {
    return Math.atan2(x - center.cx, center.cy - y);
}; };
exports.generateSvg2rotation = generateSvg2rotation;
var generateSvg2polar = function (center) {
    return function (x, y) {
        var angle = Math.atan2(x - center.cx, center.cy - y);
        return [Math.sqrt(Math.pow((x - center.cx), 2) + Math.pow((center.cy - y), 2)), angle];
    };
};
exports.generateSvg2polar = generateSvg2polar;
var generatePolar2svg = function (center) {
    return function (radius, rotation) {
        return [center.cx + radius * Math.sin(rotation), center.cy - radius * Math.cos(rotation)];
    };
};
exports.generatePolar2svg = generatePolar2svg;
