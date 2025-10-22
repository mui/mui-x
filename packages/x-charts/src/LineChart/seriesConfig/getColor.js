"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getColor = function (series, xAxis, yAxis) {
    var yColorScale = yAxis === null || yAxis === void 0 ? void 0 : yAxis.colorScale;
    var xColorScale = xAxis === null || xAxis === void 0 ? void 0 : xAxis.colorScale;
    if (yColorScale) {
        return function (dataIndex) {
            if (dataIndex === undefined) {
                return series.color;
            }
            var value = series.data[dataIndex];
            var color = value === null ? series.color : yColorScale(value);
            if (color === null) {
                return series.color;
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
            var color = value === null ? series.color : xColorScale(value);
            if (color === null) {
                return series.color;
            }
            return color;
        };
    }
    return function () { return series.color; };
};
exports.default = getColor;
