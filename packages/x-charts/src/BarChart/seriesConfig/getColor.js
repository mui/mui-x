"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getColor = function (series, xAxis, yAxis) {
    var verticalLayout = series.layout === 'vertical';
    var bandColorScale = verticalLayout ? xAxis === null || xAxis === void 0 ? void 0 : xAxis.colorScale : yAxis === null || yAxis === void 0 ? void 0 : yAxis.colorScale;
    var valueColorScale = verticalLayout ? yAxis === null || yAxis === void 0 ? void 0 : yAxis.colorScale : xAxis === null || xAxis === void 0 ? void 0 : xAxis.colorScale;
    var bandValues = verticalLayout ? xAxis === null || xAxis === void 0 ? void 0 : xAxis.data : yAxis === null || yAxis === void 0 ? void 0 : yAxis.data;
    if (valueColorScale) {
        return function (dataIndex) {
            if (dataIndex === undefined) {
                return series.color;
            }
            var value = series.data[dataIndex];
            var color = value === null ? series.color : valueColorScale(value);
            if (color === null) {
                return series.color;
            }
            return color;
        };
    }
    if (bandColorScale && bandValues) {
        return function (dataIndex) {
            if (dataIndex === undefined) {
                return series.color;
            }
            var value = bandValues[dataIndex];
            var color = value === null ? series.color : bandColorScale(value);
            if (color === null) {
                return series.color;
            }
            return color;
        };
    }
    return function () { return series.color; };
};
exports.default = getColor;
