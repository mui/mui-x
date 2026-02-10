"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getSeriesColorFn_1 = require("../../internals/getSeriesColorFn");
var getColor = function (series) {
    var getSeriesColor = (0, getSeriesColorFn_1.getSeriesColorFn)(series);
    return function (dataIndex) {
        if (dataIndex === undefined) {
            return series.color;
        }
        var value = series.data[dataIndex];
        return getSeriesColor({ value: value, dataIndex: dataIndex });
    };
};
exports.default = getColor;
