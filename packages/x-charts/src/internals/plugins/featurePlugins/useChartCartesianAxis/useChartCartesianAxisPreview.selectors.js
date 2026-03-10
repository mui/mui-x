"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartPreviewComputedYAxis = exports.selectorChartPreviewYScales = exports.selectorChartPreviewComputedXAxis = exports.selectorChartPreviewXScales = void 0;
var store_1 = require("@mui/x-internals/store");
var useChartCartesianAxisLayout_selectors_1 = require("./useChartCartesianAxisLayout.selectors");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var computeAxisValue_1 = require("./computeAxisValue");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
var useChartDimensions_1 = require("../../corePlugins/useChartDimensions");
var constants_1 = require("../../../constants");
var getAxisScale_1 = require("./getAxisScale");
var zoom_1 = require("./zoom");
var scaleGuards_1 = require("../../../scaleGuards");
var useChartSeriesConfig_1 = require("../../corePlugins/useChartSeriesConfig");
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
exports.selectorChartPreviewXScales = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartDimensions_1.selectorChartDrawingArea, useChartCartesianAxisRendering_selectors_1.selectorChartZoomOptionsLookup, useChartCartesianAxisRendering_selectors_1.selectorChartNormalizedXScales, function selectorChartPreviewXScales(xAxes, chartDrawingArea, zoomOptions, normalizedXScales, axisId) {
    var hasAxis = xAxes === null || xAxes === void 0 ? void 0 : xAxes.some(function (axis) { return axis.id === axisId; });
    var drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);
    var options = zoomOptions[axisId];
    var scales = {};
    xAxes === null || xAxes === void 0 ? void 0 : xAxes.forEach(function (eachAxis) {
        var axis = eachAxis;
        var scale = normalizedXScales[axis.id].copy();
        var range = (0, getAxisScale_1.getRange)(drawingArea, 'x', axis);
        var zoomedRange = (0, zoom_1.zoomScaleRange)(range, [options.minStart, options.maxEnd]);
        scale.range(zoomedRange);
        scales[axis.id] = scale;
    });
    return scales;
});
exports.selectorChartPreviewComputedXAxis = (0, store_1.createSelectorMemoized)(useChartSeries_1.selectorChartSeriesProcessed, useChartSeriesConfig_1.selectorChartSeriesConfig, useChartCartesianAxisRendering_selectors_1.selectorChartZoomOptionsLookup, useChartDimensions_1.selectorChartDrawingArea, exports.selectorChartPreviewXScales, useChartCartesianAxisRendering_selectors_1.selectorChartXAxisWithDomains, function (formattedSeries, seriesConfig, zoomOptions, chartDrawingArea, scales, _a, axisId) {
    var _b;
    var axes = _a.axes, domains = _a.domains;
    var hasAxis = axes === null || axes === void 0 ? void 0 : axes.some(function (axis) { return axis.id === axisId; });
    var drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);
    var options = zoomOptions[axisId];
    var zoomMap = new Map([
        [axisId, { axisId: axisId, start: options.minStart, end: options.maxEnd }],
    ]);
    var computedAxes = (0, computeAxisValue_1.computeAxisValue)({
        scales: scales,
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axes,
        seriesConfig: seriesConfig,
        axisDirection: 'x',
        zoomMap: zoomMap,
        domains: domains,
    });
    if (computedAxes.axis[axisId]) {
        return _b = {}, _b[axisId] = computedAxes.axis[axisId], _b;
    }
    return computedAxes.axis;
});
exports.selectorChartPreviewYScales = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, useChartDimensions_1.selectorChartDrawingArea, useChartCartesianAxisRendering_selectors_1.selectorChartZoomOptionsLookup, useChartCartesianAxisRendering_selectors_1.selectorChartNormalizedYScales, function selectorChartPreviewYScales(yAxes, chartDrawingArea, zoomOptions, normalizedYScales, axisId) {
    var hasAxis = yAxes === null || yAxes === void 0 ? void 0 : yAxes.some(function (axis) { return axis.id === axisId; });
    var drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);
    var options = zoomOptions[axisId];
    var scales = {};
    yAxes === null || yAxes === void 0 ? void 0 : yAxes.forEach(function (eachAxis) {
        var axis = eachAxis;
        var scale = normalizedYScales[axis.id].copy();
        var range = (0, getAxisScale_1.getRange)(drawingArea, 'y', axis);
        if ((0, scaleGuards_1.isOrdinalScale)(scale)) {
            range = range.reverse();
        }
        var zoomedRange = (0, zoom_1.zoomScaleRange)(range, [options.minStart, options.maxEnd]);
        scale.range(zoomedRange);
        scales[axis.id] = scale;
    });
    return scales;
});
exports.selectorChartPreviewComputedYAxis = (0, store_1.createSelectorMemoized)(useChartSeries_1.selectorChartSeriesProcessed, useChartSeriesConfig_1.selectorChartSeriesConfig, useChartCartesianAxisRendering_selectors_1.selectorChartZoomOptionsLookup, useChartDimensions_1.selectorChartDrawingArea, exports.selectorChartPreviewYScales, useChartCartesianAxisRendering_selectors_1.selectorChartYAxisWithDomains, function (formattedSeries, seriesConfig, zoomOptions, chartDrawingArea, scales, _a, axisId) {
    var _b;
    var axes = _a.axes, domains = _a.domains;
    var hasAxis = axes === null || axes === void 0 ? void 0 : axes.some(function (axis) { return axis.id === axisId; });
    var drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);
    var options = zoomOptions[axisId];
    var zoomMap = new Map([
        [axisId, { axisId: axisId, start: options.minStart, end: options.maxEnd }],
    ]);
    var computedAxes = (0, computeAxisValue_1.computeAxisValue)({
        scales: scales,
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axes,
        seriesConfig: seriesConfig,
        axisDirection: 'y',
        zoomMap: zoomMap,
        domains: domains,
    });
    if (computedAxes.axis[axisId]) {
        return _b = {}, _b[axisId] = computedAxes.axis[axisId], _b;
    }
    return computedAxes.axis;
});
