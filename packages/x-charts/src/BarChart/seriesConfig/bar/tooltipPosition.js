"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getBarDimensions_1 = require("../../../internals/getBarDimensions");
var tooltipItemPositionGetter = function (params) {
    var _a;
    var series = params.series, identifier = params.identifier, axesConfig = params.axesConfig, placement = params.placement;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var itemSeries = (_a = series.bar) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (series.bar == null || itemSeries == null) {
        return null;
    }
    if (axesConfig.x === undefined || axesConfig.y === undefined) {
        return null;
    }
    var dimensions = (0, getBarDimensions_1.getBarDimensions)({
        verticalLayout: itemSeries.layout === 'vertical',
        xAxisConfig: axesConfig.x,
        yAxisConfig: axesConfig.y,
        series: itemSeries,
        dataIndex: identifier.dataIndex,
        numberOfGroups: series.bar.stackingGroups.length,
        groupIndex: series.bar.stackingGroups.findIndex(function (group) { return group.ids.includes(itemSeries.id); }),
    });
    if (dimensions == null) {
        return null;
    }
    var x = dimensions.x, y = dimensions.y, width = dimensions.width, height = dimensions.height;
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
