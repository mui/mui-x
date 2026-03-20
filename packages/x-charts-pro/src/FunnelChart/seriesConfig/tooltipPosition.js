"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var coordinateMapper_1 = require("../coordinateMapper");
var tooltipItemPositionGetter = function (params) {
    var _a;
    var series = params.series, identifier = params.identifier, axesConfig = params.axesConfig, placement = params.placement;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var itemSeries = (_a = series.funnel) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (itemSeries == null) {
        return null;
    }
    if (axesConfig.x === undefined || axesConfig.y === undefined) {
        return null;
    }
    var isHorizontal = itemSeries.layout === 'horizontal';
    var baseScaleConfig = isHorizontal ? axesConfig.x : axesConfig.y;
    // FIXME gap should be obtained from the store.
    // Maybe moving it to the series would be a good idea similar to what we do with bar charts and their stackingGroups
    var gap = 0;
    var xPosition = (0, coordinateMapper_1.createPositionGetter)(axesConfig.x.scale, isHorizontal, gap, baseScaleConfig.data);
    var yPosition = (0, coordinateMapper_1.createPositionGetter)(axesConfig.y.scale, !isHorizontal, gap, baseScaleConfig.data);
    var allY = itemSeries.dataPoints[identifier.dataIndex].map(function (v) {
        return yPosition(v.y, identifier.dataIndex, v.stackOffset, v.useBandWidth);
    });
    var allX = itemSeries.dataPoints[identifier.dataIndex].map(function (v) {
        return xPosition(v.x, identifier.dataIndex, v.stackOffset, v.useBandWidth);
    });
    var _b = (0, internals_1.findMinMax)(allX), x0 = _b[0], x1 = _b[1];
    var _c = (0, internals_1.findMinMax)(allY), y0 = _c[0], y1 = _c[1];
    switch (placement) {
        case 'bottom':
            return { x: (x1 + x0) / 2, y: y1 };
        case 'left':
            return { x: x0, y: (y1 + y0) / 2 };
        case 'right':
            return { x: x1, y: (y1 + y0) / 2 };
        case 'top':
        default:
            return { x: (x1 + x0) / 2, y: y0 };
    }
};
exports.default = tooltipItemPositionGetter;
