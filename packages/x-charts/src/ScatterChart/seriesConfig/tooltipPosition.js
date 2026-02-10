"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tooltipItemPositionGetter = function (params) {
    var _a, _b, _c;
    var series = params.series, identifier = params.identifier, axesConfig = params.axesConfig;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var itemSeries = (_a = series.scatter) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (itemSeries == null) {
        return null;
    }
    if (axesConfig.x === undefined || axesConfig.y === undefined) {
        return null;
    }
    var xValue = (_b = itemSeries.data) === null || _b === void 0 ? void 0 : _b[identifier.dataIndex].x;
    var yValue = (_c = itemSeries.data) === null || _c === void 0 ? void 0 : _c[identifier.dataIndex].y;
    if (xValue == null || yValue == null) {
        return null;
    }
    return {
        x: axesConfig.x.scale(xValue),
        y: axesConfig.y.scale(yValue),
    };
};
exports.default = tooltipItemPositionGetter;
