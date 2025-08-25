"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartPolarCenter = exports.selectorChartRadiusAxis = exports.selectorChartRotationAxis = exports.selectorChartRawRadiusAxis = exports.selectorChartRawRotationAxis = exports.selectorChartPolarAxisState = void 0;
var useChartDimensions_1 = require("../../corePlugins/useChartDimensions");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var selectors_1 = require("../../utils/selectors");
var computeAxisValue_1 = require("./computeAxisValue");
var selectorChartPolarAxisState = function (state) {
    return state.polarAxis;
};
exports.selectorChartPolarAxisState = selectorChartPolarAxisState;
exports.selectorChartRawRotationAxis = (0, selectors_1.createSelector)([exports.selectorChartPolarAxisState], function (axis) { return axis === null || axis === void 0 ? void 0 : axis.rotation; });
exports.selectorChartRawRadiusAxis = (0, selectors_1.createSelector)([exports.selectorChartPolarAxisState], function (axis) { return axis === null || axis === void 0 ? void 0 : axis.radius; });
/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */
exports.selectorChartRotationAxis = (0, selectors_1.createSelector)([
    exports.selectorChartRawRotationAxis,
    useChartDimensions_1.selectorChartDrawingArea,
    useChartSeries_1.selectorChartSeriesProcessed,
    useChartSeries_1.selectorChartSeriesConfig,
], function (axis, drawingArea, formattedSeries, seriesConfig) {
    return (0, computeAxisValue_1.computeAxisValue)({
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axis,
        seriesConfig: seriesConfig,
        axisDirection: 'rotation',
    });
});
exports.selectorChartRadiusAxis = (0, selectors_1.createSelector)([
    exports.selectorChartRawRadiusAxis,
    useChartDimensions_1.selectorChartDrawingArea,
    useChartSeries_1.selectorChartSeriesProcessed,
    useChartSeries_1.selectorChartSeriesConfig,
], function (axis, drawingArea, formattedSeries, seriesConfig) {
    return (0, computeAxisValue_1.computeAxisValue)({
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axis,
        seriesConfig: seriesConfig,
        axisDirection: 'radius',
    });
});
exports.selectorChartPolarCenter = (0, selectors_1.createSelector)([useChartDimensions_1.selectorChartDrawingArea], function (drawingArea) { return ({
    cx: drawingArea.left + drawingArea.width / 2,
    cy: drawingArea.top + drawingArea.height / 2,
}); });
