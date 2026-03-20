"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var tooltipItemPositionGetter = function (params) {
    var _a;
    var series = params.series, identifier = params.identifier, axesConfig = params.axesConfig, placement = params.placement;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var itemSeries = (_a = series.ohlc) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (itemSeries == null) {
        return null;
    }
    if (axesConfig.x === undefined || axesConfig.y === undefined) {
        return null;
    }
    var datum = itemSeries.data[identifier.dataIndex];
    if (!datum) {
        return null;
    }
    var xScale = axesConfig.x.scale;
    var yScale = axesConfig.y.scale;
    if (!(0, internals_1.isBandScale)(xScale) || (0, internals_1.isOrdinalScale)(yScale)) {
        return null;
    }
    var high = datum[1], low = datum[2];
    var x = xScale(xScale.domain()[identifier.dataIndex]);
    var width = xScale.bandwidth();
    var y = yScale(high);
    var height = yScale(low) - yScale(high);
    switch (placement) {
        case 'right':
            return { x: x + width, y: y + height / 2 };
        case 'bottom':
            return { x: x + width / 2, y: y + height };
        case 'left':
            return { x: x, y: y + height / 2 };
        case 'top':
        default:
            return { x: x + width / 2, y: y };
    }
};
exports.default = tooltipItemPositionGetter;
