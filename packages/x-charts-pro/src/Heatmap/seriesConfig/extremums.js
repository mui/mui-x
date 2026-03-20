"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseExtremum = void 0;
var internals_1 = require("@mui/x-charts/internals");
var getBaseExtremum = function (params) {
    var _a;
    var axis = params.axis;
    return (0, internals_1.findMinMax)((_a = axis.data) !== null && _a !== void 0 ? _a : []);
};
exports.getBaseExtremum = getBaseExtremum;
