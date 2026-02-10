"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tooltipItemPositionGetter = function (params) {
    var _a, _b;
    var series = params.series, identifier = params.identifier, axesConfig = params.axesConfig;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var itemSeries = (_a = series.line) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (itemSeries == null) {
        return null;
    }
    if (axesConfig.x === undefined || axesConfig.y === undefined) {
        return null;
    }
    var xValue = (_b = axesConfig.x.data) === null || _b === void 0 ? void 0 : _b[identifier.dataIndex];
    var yValue = itemSeries.data[identifier.dataIndex] == null
        ? null
        : itemSeries.visibleStackedData[identifier.dataIndex][1];
    if (xValue == null || yValue == null) {
        return null;
    }
    return {
        x: axesConfig.x.scale(xValue),
        y: axesConfig.y.scale(yValue),
    };
};
exports.default = tooltipItemPositionGetter;
