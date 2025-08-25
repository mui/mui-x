"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartPreviewComputedYAxis = exports.selectorChartPreviewComputedXAxis = void 0;
var selectors_1 = require("../../utils/selectors");
var useChartCartesianAxisLayout_selectors_1 = require("./useChartCartesianAxisLayout.selectors");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var computeAxisValue_1 = require("./computeAxisValue");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
var useChartDimensions_1 = require("../../corePlugins/useChartDimensions");
var constants_1 = require("../../../constants");
function createPreviewDrawingArea(axisDirection, mainChartDrawingArea) {
    return axisDirection === 'x'
        ? {
            left: 0,
            top: 0,
            width: mainChartDrawingArea.width,
            height: constants_1.ZOOM_SLIDER_PREVIEW_SIZE,
            right: mainChartDrawingArea.width,
            bottom: constants_1.ZOOM_SLIDER_PREVIEW_SIZE,
        }
        : {
            left: 0,
            top: 0,
            width: constants_1.ZOOM_SLIDER_PREVIEW_SIZE,
            height: mainChartDrawingArea.height,
            right: constants_1.ZOOM_SLIDER_PREVIEW_SIZE,
            bottom: mainChartDrawingArea.height,
        };
}
exports.selectorChartPreviewComputedXAxis = (0, selectors_1.createSelector)([
    useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis,
    useChartSeries_1.selectorChartSeriesProcessed,
    useChartSeries_1.selectorChartSeriesConfig,
    useChartCartesianAxisRendering_selectors_1.selectorChartZoomOptionsLookup,
    useChartCartesianAxisRendering_selectors_1.selectorChartZoomAxisFilters,
    useChartDimensions_1.selectorChartDrawingArea,
    function (_, axisId) { return axisId; },
], function (xAxes, formattedSeries, seriesConfig, zoomOptions, getFilters, chartDrawingArea, axisId) {
    var _a;
    var hasAxis = xAxes === null || xAxes === void 0 ? void 0 : xAxes.some(function (axis) { return axis.id === axisId; });
    var drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);
    var options = zoomOptions[axisId];
    var zoomMap = new Map([
        [axisId, { axisId: axisId, start: options.minStart, end: options.maxEnd }],
    ]);
    var computedAxes = (0, computeAxisValue_1.computeAxisValue)({
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: xAxes,
        seriesConfig: seriesConfig,
        axisDirection: 'x',
        zoomMap: zoomMap,
        zoomOptions: zoomOptions,
        getFilters: getFilters,
    });
    if (computedAxes.axis[axisId]) {
        return _a = {}, _a[axisId] = computedAxes.axis[axisId], _a;
    }
    return computedAxes.axis;
});
exports.selectorChartPreviewComputedYAxis = (0, selectors_1.createSelector)([
    useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis,
    useChartSeries_1.selectorChartSeriesProcessed,
    useChartSeries_1.selectorChartSeriesConfig,
    useChartCartesianAxisRendering_selectors_1.selectorChartZoomOptionsLookup,
    useChartCartesianAxisRendering_selectors_1.selectorChartZoomAxisFilters,
    useChartDimensions_1.selectorChartDrawingArea,
    function (_, axisId) { return axisId; },
], function (yAxes, formattedSeries, seriesConfig, zoomOptions, getFilters, chartDrawingArea, axisId) {
    var _a;
    var hasAxis = yAxes === null || yAxes === void 0 ? void 0 : yAxes.some(function (axis) { return axis.id === axisId; });
    var drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);
    var options = zoomOptions[axisId];
    var zoomMap = new Map([
        [axisId, { axisId: axisId, start: options.minStart, end: options.maxEnd }],
    ]);
    var computedAxes = (0, computeAxisValue_1.computeAxisValue)({
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: yAxes,
        seriesConfig: seriesConfig,
        axisDirection: 'y',
        zoomMap: zoomMap,
        zoomOptions: zoomOptions,
        getFilters: getFilters,
    });
    if (computedAxes.axis[axisId]) {
        return _a = {}, _a[axisId] = computedAxes.axis[axisId], _a;
    }
    return computedAxes.axis;
});
