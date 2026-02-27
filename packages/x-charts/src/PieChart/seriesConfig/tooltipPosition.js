"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findMinMax_1 = require("../../internals/findMinMax");
var tooltipItemPositionGetter = function (params) {
    var _a, _b;
    var series = params.series, identifier = params.identifier, placement = params.placement, seriesLayout = params.seriesLayout;
    if (!identifier || identifier.dataIndex === undefined) {
        return null;
    }
    var itemSeries = (_a = series.pie) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    var layout = (_b = seriesLayout.pie) === null || _b === void 0 ? void 0 : _b[identifier.seriesId];
    if (itemSeries == null || layout == null) {
        return null;
    }
    var center = layout.center, radius = layout.radius;
    var data = itemSeries.data;
    var dataItem = data[identifier.dataIndex];
    if (!dataItem) {
        return null;
    }
    // Compute the 4 corner points of the arc to get the bounding box.
    var points = [
        [radius.inner, dataItem.startAngle],
        [radius.inner, dataItem.endAngle],
        [radius.outer, dataItem.startAngle],
        [radius.outer, dataItem.endAngle],
    ].map(function (_a) {
        var r = _a[0], angle = _a[1];
        return ({
            x: center.x + r * Math.sin(angle),
            y: center.y - r * Math.cos(angle),
        });
    });
    var _c = (0, findMinMax_1.findMinMax)(points.map(function (p) { return p.x; })), x0 = _c[0], x1 = _c[1];
    var _d = (0, findMinMax_1.findMinMax)(points.map(function (p) { return p.y; })), y0 = _d[0], y1 = _d[1];
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
