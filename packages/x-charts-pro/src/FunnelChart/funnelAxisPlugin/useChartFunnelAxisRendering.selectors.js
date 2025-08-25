"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartYAxis = exports.selectorChartXAxis = exports.selectorFunnelGap = exports.selectorFunnel = void 0;
var internals_1 = require("@mui/x-charts/internals");
var computeAxisValue_1 = require("./computeAxisValue");
var selectorFunnel = function (state) {
    return state.funnel;
};
exports.selectorFunnel = selectorFunnel;
exports.selectorFunnelGap = (0, internals_1.createSelector)([exports.selectorFunnel], function (funnel) { var _a; return (_a = funnel === null || funnel === void 0 ? void 0 : funnel.gap) !== null && _a !== void 0 ? _a : 0; });
exports.selectorChartXAxis = (0, internals_1.createSelector)([
    internals_1.selectorChartRawXAxis,
    internals_1.selectorChartDrawingArea,
    internals_1.selectorChartSeriesProcessed,
    internals_1.selectorChartSeriesConfig,
    exports.selectorFunnelGap,
], function (axis, drawingArea, formattedSeries, seriesConfig, gap) {
    return (0, computeAxisValue_1.computeAxisValue)({
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axis,
        seriesConfig: seriesConfig,
        axisDirection: 'x',
        gap: gap,
    });
});
exports.selectorChartYAxis = (0, internals_1.createSelector)([
    internals_1.selectorChartRawYAxis,
    internals_1.selectorChartDrawingArea,
    internals_1.selectorChartSeriesProcessed,
    internals_1.selectorChartSeriesConfig,
    exports.selectorFunnelGap,
], function (axis, drawingArea, formattedSeries, seriesConfig, gap) {
    return (0, computeAxisValue_1.computeAxisValue)({
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axis,
        seriesConfig: seriesConfig,
        axisDirection: 'y',
        gap: gap,
    });
});
