"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getSeriesColorFn_1 = require("../../internals/getSeriesColorFn");
var getColor = function (series, xAxis, yAxis, zAxis) {
    var zColorScale = zAxis === null || zAxis === void 0 ? void 0 : zAxis.colorScale;
    var yColorScale = yAxis === null || yAxis === void 0 ? void 0 : yAxis.colorScale;
    var xColorScale = xAxis === null || xAxis === void 0 ? void 0 : xAxis.colorScale;
    var getSeriesColor = (0, getSeriesColorFn_1.getSeriesColorFn)(series);
    if (zColorScale) {
        return function (dataIndex) {
            var _a, _b;
            if (dataIndex === undefined) {
                return series.color;
            }
            if (((_a = zAxis === null || zAxis === void 0 ? void 0 : zAxis.data) === null || _a === void 0 ? void 0 : _a[dataIndex]) !== undefined) {
                var color_1 = zColorScale((_b = zAxis === null || zAxis === void 0 ? void 0 : zAxis.data) === null || _b === void 0 ? void 0 : _b[dataIndex]);
                if (color_1 !== null) {
                    return color_1;
                }
            }
            var value = series.data[dataIndex];
            var color = value === null ? getSeriesColor({ value: value, dataIndex: dataIndex }) : zColorScale(value.z);
            if (color === null) {
                return getSeriesColor({ value: value, dataIndex: dataIndex });
            }
            return color;
        };
    }
    if (yColorScale) {
        return function (dataIndex) {
            if (dataIndex === undefined) {
                return series.color;
            }
            var value = series.data[dataIndex];
            var color = value === null ? getSeriesColor({ value: value, dataIndex: dataIndex }) : yColorScale(value.y);
            if (color === null) {
                return getSeriesColor({ value: value, dataIndex: dataIndex });
            }
            return color;
        };
    }
    if (xColorScale) {
        return function (dataIndex) {
            if (dataIndex === undefined) {
                return series.color;
            }
            var value = series.data[dataIndex];
            var color = value === null ? getSeriesColor({ value: value, dataIndex: dataIndex }) : xColorScale(value.x);
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
