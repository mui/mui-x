"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coordinateTransformation_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis/coordinateTransformation");
var useChartPolarAxis_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis");
var tooltipItemPositionGetter = function (params) {
    var _a, _b;
    var series = params.series, identifier = params.identifier, axesConfig = params.axesConfig, drawingArea = params.drawingArea, placement = params.placement;
    if (!identifier) {
        return null;
    }
    var itemSeries = (_a = series.radar) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (itemSeries == null) {
        return null;
    }
    var radiusAxes = axesConfig.radiusAxes, rotationAxes = axesConfig.rotationAxes;
    if (radiusAxes === undefined || rotationAxes === undefined) {
        return null;
    }
    // Only one rotation axis is supported for radar charts
    var rotationAxis = rotationAxes.axis[rotationAxes.axisIds[0]];
    var metrics = (_b = rotationAxis.scale.domain()) !== null && _b !== void 0 ? _b : [];
    var angles = metrics.map(function (key) { return rotationAxis.scale(key); });
    var _c = (0, useChartPolarAxis_1.getDrawingAreaCenter)(drawingArea), cx = _c.cx, cy = _c.cy;
    var polar2svg = (0, coordinateTransformation_1.generatePolar2svg)({ cx: cx, cy: cy });
    var points = itemSeries.data.map(function (value, dataIndex) {
        var rId = radiusAxes.axisIds[dataIndex];
        var r = radiusAxes.axis[rId].scale(value);
        var angle = angles[dataIndex];
        return polar2svg(r, angle);
    });
    if (points.length === 0) {
        return null;
    }
    if (identifier.dataIndex != null) {
        var point = points[identifier.dataIndex];
        switch (placement) {
            case 'right':
                return { x: point[0] + 4, y: point[1] };
            case 'bottom':
                return { x: point[0], y: point[1] + 4 };
            case 'left':
                return { x: point[0] - 4, y: point[1] };
            case 'top':
            default:
                return { x: point[0], y: point[1] - 4 };
        }
    }
    var _d = points.reduce(function (acc, _a) {
        var x = _a[0], y = _a[1];
        return [Math.min(y, acc[0]), Math.max(x, acc[1]), Math.max(y, acc[2]), Math.min(x, acc[3])];
    }, [Infinity, -Infinity, -Infinity, Infinity]), top = _d[0], right = _d[1], bottom = _d[2], left = _d[3];
    switch (placement) {
        case 'right':
            return { x: right, y: (top + bottom) / 2 };
        case 'bottom':
            return { x: (left + right) / 2, y: bottom };
        case 'left':
            return { x: left, y: (top + bottom) / 2 };
        case 'top':
        default:
            return { x: (left + right) / 2, y: top };
    }
};
exports.default = tooltipItemPositionGetter;
