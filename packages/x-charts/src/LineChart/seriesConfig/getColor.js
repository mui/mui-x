"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getSeriesColorFn_1 = require("../../internals/getSeriesColorFn");
var getColor = function (series, xAxis, yAxis) {
    var yColorScale = yAxis === null || yAxis === void 0 ? void 0 : yAxis.colorScale;
    var xColorScale = xAxis === null || xAxis === void 0 ? void 0 : xAxis.colorScale;
    var getSeriesColor = (0, getSeriesColorFn_1.getSeriesColorFn)(series);
    if (yColorScale) {
        return function (dataIndex) {
            if (dataIndex === undefined) {
                return series.color;
            }
            var value = series.data[dataIndex];
            var color = value === null ? getSeriesColor({ value: value, dataIndex: dataIndex }) : yColorScale(value);
            if (color === null) {
                return getSeriesColor({ value: value, dataIndex: dataIndex });
            }
            return color;
        };
    }
    if (xColorScale) {
        return function (dataIndex) {
            var _a;
            if (dataIndex === undefined) {
                return series.color;
            }
            var value = (_a = xAxis.data) === null || _a === void 0 ? void 0 : _a[dataIndex];
            var color = value === null ? getSeriesColor({ value: value, dataIndex: dataIndex }) : xColorScale(value);
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
