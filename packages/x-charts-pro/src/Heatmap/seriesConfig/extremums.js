"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseExtremum = void 0;
var getBaseExtremum = function (params) {
    var _a, _b;
    var axis = params.axis;
    var minX = Math.min.apply(Math, ((_a = axis.data) !== null && _a !== void 0 ? _a : []));
    var maxX = Math.max.apply(Math, ((_b = axis.data) !== null && _b !== void 0 ? _b : []));
    return [minX, maxX];
};
exports.getBaseExtremum = getBaseExtremum;
