"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getPercentageValue_1 = require("../../internals/getPercentageValue");
var getPieCoordinates_1 = require("../getPieCoordinates");
var seriesLayout = function (series, drawingArea) {
    var seriesLayoutRecord = {};
    for (var _i = 0, _a = series.seriesOrder; _i < _a.length; _i++) {
        var seriesId = _a[_i];
        var _b = series.series[seriesId], innerRadius = _b.innerRadius, outerRadius = _b.outerRadius, arcLabelRadius = _b.arcLabelRadius, cxParam = _b.cx, cyParam = _b.cy;
        var _c = (0, getPieCoordinates_1.getPieCoordinates)({ cx: cxParam, cy: cyParam }, { width: drawingArea.width, height: drawingArea.height }), cx = _c.cx, cy = _c.cy, availableRadius = _c.availableRadius;
        var outer = (0, getPercentageValue_1.getPercentageValue)(outerRadius !== null && outerRadius !== void 0 ? outerRadius : availableRadius, availableRadius);
        var inner = (0, getPercentageValue_1.getPercentageValue)(innerRadius !== null && innerRadius !== void 0 ? innerRadius : 0, availableRadius);
        var label = arcLabelRadius === undefined
            ? (inner + outer) / 2
            : (0, getPercentageValue_1.getPercentageValue)(arcLabelRadius, availableRadius);
        seriesLayoutRecord[seriesId] = {
            radius: {
                available: availableRadius,
                inner: inner,
                outer: outer,
                label: label,
            },
            center: {
                x: drawingArea.left + cx,
                y: drawingArea.top + cy,
            },
        };
    }
    return seriesLayoutRecord;
};
exports.default = seriesLayout;
