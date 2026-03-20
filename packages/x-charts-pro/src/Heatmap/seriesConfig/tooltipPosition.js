"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var tooltipItemPositionGetter = function (params) {
    var _a;
    var series = params.series, identifier = params.identifier, axesConfig = params.axesConfig, placement = params.placement;
    if (!identifier) {
        return null;
    }
    var itemSeries = (_a = series.heatmap) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (itemSeries == null) {
        return null;
    }
    if (axesConfig.x === undefined ||
        axesConfig.y === undefined ||
        !(0, internals_1.isBandScaleConfig)(axesConfig.x) ||
        !(0, internals_1.isBandScaleConfig)(axesConfig.y)) {
        return null;
    }
    var x = axesConfig.x.scale(axesConfig.x.scale.domain()[identifier.xIndex]);
    var y = axesConfig.y.scale(axesConfig.y.scale.domain()[identifier.yIndex]);
    if (x === undefined || y === undefined) {
        return null;
    }
    var width = axesConfig.x.scale.bandwidth();
    var height = axesConfig.y.scale.bandwidth();
    switch (placement) {
        case 'bottom':
            return { x: x + width / 2, y: y + height };
        case 'left':
            return { x: x, y: y + height / 2 };
        case 'right':
            return { x: x + width, y: y + height / 2 };
        case 'top':
        default:
            return { x: x + width / 2, y: y };
    }
};
exports.default = tooltipItemPositionGetter;
