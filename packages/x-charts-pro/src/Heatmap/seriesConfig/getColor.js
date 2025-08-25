"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getColor = function (series, xAxis, yAxis, zAxis) {
    var zColorScale = zAxis === null || zAxis === void 0 ? void 0 : zAxis.colorScale;
    if (zColorScale) {
        return function (dataIndex) {
            var value = series.data[dataIndex];
            var color = zColorScale(value[2]);
            if (color === null) {
                return '';
            }
            return color;
        };
    }
    return function () { return ''; };
};
exports.default = getColor;
