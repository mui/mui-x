"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var getColor = function (series, xAxis) {
    var bandColorScale = xAxis === null || xAxis === void 0 ? void 0 : xAxis.colorScale;
    var bandValues = xAxis === null || xAxis === void 0 ? void 0 : xAxis.data;
    var getSeriesColor = (0, internals_1.getSeriesColorFn)(series);
    if (bandColorScale && bandValues) {
        return function (dataIndex) {
            if (dataIndex === undefined) {
                return series.color;
            }
            var value = bandValues[dataIndex];
            var color = value === null ? getSeriesColor({ value: value, dataIndex: dataIndex }) : bandColorScale(value);
            if (color === null) {
                return getSeriesColor({ value: value, dataIndex: dataIndex });
            }
            return color;
        };
    }
    return function (dataIndex) {
        if (dataIndex === undefined) {
            return series.color;
        }
        var value = series.data[dataIndex];
        return getSeriesColor({ value: value, dataIndex: dataIndex });
    };
};
exports.default = getColor;
