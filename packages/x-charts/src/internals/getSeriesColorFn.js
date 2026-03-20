"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeriesColorFn = getSeriesColorFn;
function getSeriesColorFn(series) {
    return series.colorGetter ? series.colorGetter : function () { return series.color; };
}
