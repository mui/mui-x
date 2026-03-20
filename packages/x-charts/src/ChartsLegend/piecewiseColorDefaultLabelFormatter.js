"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.piecewiseColorDefaultLabelFormatter = piecewiseColorDefaultLabelFormatter;
function piecewiseColorDefaultLabelFormatter(params) {
    if (params.min === null) {
        return "<".concat(params.formattedMax);
    }
    if (params.max === null) {
        return ">".concat(params.formattedMin);
    }
    return "".concat(params.formattedMin, "-").concat(params.formattedMax);
}
