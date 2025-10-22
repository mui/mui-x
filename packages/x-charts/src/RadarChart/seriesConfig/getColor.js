"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getColor = function (series) {
    return function () { return series.color; };
};
exports.default = getColor;
