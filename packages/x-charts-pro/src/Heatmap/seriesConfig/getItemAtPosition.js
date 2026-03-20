"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getItemAtPosition;
var internals_1 = require("@mui/x-charts/internals");
function getItemAtPosition(state, point) {
    var _a;
    var _b = (0, internals_1.selectorChartXAxis)(state), xAxis = _b.axis, xAxisIds = _b.axisIds;
    var _c = (0, internals_1.selectorChartYAxis)(state), yAxis = _c.axis, yAxisIds = _c.axisIds;
    var series = (0, internals_1.selectorAllSeriesOfType)(state, 'heatmap');
    var xAxisWithScale = xAxis[xAxisIds[0]];
    var yAxisWithScale = yAxis[yAxisIds[0]];
    var seriesId = series === null || series === void 0 ? void 0 : series.seriesOrder[0];
    if (seriesId === undefined) {
        return undefined;
    }
    var xIndex = (0, internals_1.getCartesianAxisIndex)(xAxisWithScale, point.x);
    var yIndex = (0, internals_1.getCartesianAxisIndex)(yAxisWithScale, point.y);
    if (xIndex === -1 || yIndex === -1) {
        return undefined;
    }
    var value = (_a = series === null || series === void 0 ? void 0 : series.series[series.seriesOrder[0]].heatmapData.getValue(xIndex, yIndex)) !== null && _a !== void 0 ? _a : null;
    return {
        type: 'heatmap',
        seriesId: seriesId,
        xIndex: xIndex,
        yIndex: yIndex,
        value: value,
    };
}
