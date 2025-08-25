"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartRawAxis = exports.selectorChartAxis = exports.selectorChartYAxis = exports.selectorChartXAxis = exports.selectorChartZoomAxisFilters = exports.selectorChartAxisZoomOptionsLookup = exports.selectorChartZoomOptionsLookup = exports.selectorChartZoomMap = exports.selectorChartZoomIsInteracting = exports.createZoomMap = void 0;
var useChartDimensions_1 = require("../../corePlugins/useChartDimensions");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var selectors_1 = require("../../utils/selectors");
var computeAxisValue_1 = require("./computeAxisValue");
var createAxisFilterMapper_1 = require("./createAxisFilterMapper");
var createZoomLookup_1 = require("./createZoomLookup");
var useChartCartesianAxisLayout_selectors_1 = require("./useChartCartesianAxisLayout.selectors");
var useChartExperimentalFeature_1 = require("../../corePlugins/useChartExperimentalFeature");
var createZoomMap = function (zoom) {
    var zoomItemMap = new Map();
    zoom.forEach(function (zoomItem) {
        zoomItemMap.set(zoomItem.axisId, zoomItem);
    });
    return zoomItemMap;
};
exports.createZoomMap = createZoomMap;
var selectorChartZoomState = function (state) {
    return state.zoom;
};
/**
 * Following selectors are not exported because they exist in the MIT chart only to ba able to reuse the Zoom state from the pro.
 */
exports.selectorChartZoomIsInteracting = (0, selectors_1.createSelector)([selectorChartZoomState], function (zoom) { return zoom === null || zoom === void 0 ? void 0 : zoom.isInteracting; });
exports.selectorChartZoomMap = (0, selectors_1.createSelector)([selectorChartZoomState], function (zoom) { return (zoom === null || zoom === void 0 ? void 0 : zoom.zoomData) && (0, exports.createZoomMap)(zoom === null || zoom === void 0 ? void 0 : zoom.zoomData); });
exports.selectorChartZoomOptionsLookup = (0, selectors_1.createSelector)([useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis], function (xAxis, yAxis) { return (__assign(__assign({}, (0, createZoomLookup_1.createZoomLookup)('x')(xAxis)), (0, createZoomLookup_1.createZoomLookup)('y')(yAxis))); });
exports.selectorChartAxisZoomOptionsLookup = (0, selectors_1.createSelector)([exports.selectorChartZoomOptionsLookup, function (_, axisId) { return axisId; }], function (axisLookup, axisId) { return axisLookup[axisId]; });
var selectorChartXFilter = (0, selectors_1.createSelector)([
    exports.selectorChartZoomMap,
    exports.selectorChartZoomOptionsLookup,
    useChartSeries_1.selectorChartSeriesConfig,
    useChartSeries_1.selectorChartSeriesProcessed,
], function (zoomMap, zoomOptions, seriesConfig, formattedSeries) {
    return zoomMap &&
        zoomOptions &&
        (0, createAxisFilterMapper_1.createAxisFilterMapper)({
            zoomMap: zoomMap,
            zoomOptions: zoomOptions,
            seriesConfig: seriesConfig,
            formattedSeries: formattedSeries,
            direction: 'x',
        });
});
var selectorChartYFilter = (0, selectors_1.createSelector)([
    exports.selectorChartZoomMap,
    exports.selectorChartZoomOptionsLookup,
    useChartSeries_1.selectorChartSeriesConfig,
    useChartSeries_1.selectorChartSeriesProcessed,
], function (zoomMap, zoomOptions, seriesConfig, formattedSeries) {
    return zoomMap &&
        zoomOptions &&
        (0, createAxisFilterMapper_1.createAxisFilterMapper)({
            zoomMap: zoomMap,
            zoomOptions: zoomOptions,
            seriesConfig: seriesConfig,
            formattedSeries: formattedSeries,
            direction: 'y',
        });
});
exports.selectorChartZoomAxisFilters = (0, selectors_1.createSelector)([selectorChartXFilter, selectorChartYFilter, useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis], function (xMapper, yMapper, xAxis, yAxis) {
    if (xMapper === undefined || yMapper === undefined) {
        // Early return if there is no zoom.
        return undefined;
    }
    var xFilters = xAxis === null || xAxis === void 0 ? void 0 : xAxis.reduce(function (acc, axis, index) {
        var filter = xMapper(axis, index);
        if (filter !== null) {
            acc[axis.id] = filter;
        }
        return acc;
    }, {});
    var yFilters = yAxis === null || yAxis === void 0 ? void 0 : yAxis.reduce(function (acc, axis, index) {
        var filter = yMapper(axis, index);
        if (filter !== null) {
            acc[axis.id] = filter;
        }
        return acc;
    }, {});
    if (Object.keys(xFilters !== null && xFilters !== void 0 ? xFilters : {}).length === 0 && Object.keys(yFilters !== null && yFilters !== void 0 ? yFilters : {}).length === 0) {
        return undefined;
    }
    return (0, createAxisFilterMapper_1.createGetAxisFilters)(__assign(__assign({}, xFilters), yFilters));
});
/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */
exports.selectorChartXAxis = (0, selectors_1.createSelector)([
    useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis,
    useChartDimensions_1.selectorChartDrawingArea,
    useChartSeries_1.selectorChartSeriesProcessed,
    useChartSeries_1.selectorChartSeriesConfig,
    exports.selectorChartZoomMap,
    exports.selectorChartZoomOptionsLookup,
    exports.selectorChartZoomAxisFilters,
    useChartExperimentalFeature_1.selectorPreferStrictDomainInLineCharts,
], function (axis, drawingArea, formattedSeries, seriesConfig, zoomMap, zoomOptions, getFilters, preferStrictDomainInLineCharts) {
    return (0, computeAxisValue_1.computeAxisValue)({
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axis,
        seriesConfig: seriesConfig,
        axisDirection: 'x',
        zoomMap: zoomMap,
        zoomOptions: zoomOptions,
        getFilters: getFilters,
        preferStrictDomainInLineCharts: preferStrictDomainInLineCharts,
    });
});
exports.selectorChartYAxis = (0, selectors_1.createSelector)([
    useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis,
    useChartDimensions_1.selectorChartDrawingArea,
    useChartSeries_1.selectorChartSeriesProcessed,
    useChartSeries_1.selectorChartSeriesConfig,
    exports.selectorChartZoomMap,
    exports.selectorChartZoomOptionsLookup,
    exports.selectorChartZoomAxisFilters,
    useChartExperimentalFeature_1.selectorPreferStrictDomainInLineCharts,
], function (axis, drawingArea, formattedSeries, seriesConfig, zoomMap, zoomOptions, getFilters, preferStrictDomainInLineCharts) {
    return (0, computeAxisValue_1.computeAxisValue)({
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axis,
        seriesConfig: seriesConfig,
        axisDirection: 'y',
        zoomMap: zoomMap,
        zoomOptions: zoomOptions,
        getFilters: getFilters,
        preferStrictDomainInLineCharts: preferStrictDomainInLineCharts,
    });
});
exports.selectorChartAxis = (0, selectors_1.createSelector)([exports.selectorChartXAxis, exports.selectorChartYAxis, function (_, axisId) { return axisId; }], function (xAxes, yAxes, axisId) { var _a; return (_a = xAxes === null || xAxes === void 0 ? void 0 : xAxes.axis[axisId]) !== null && _a !== void 0 ? _a : yAxes === null || yAxes === void 0 ? void 0 : yAxes.axis[axisId]; });
exports.selectorChartRawAxis = (0, selectors_1.createSelector)([useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, function (state, axisId) { return axisId; }], function (xAxes, yAxes, axisId) {
    var _a, _b;
    var axis = (_b = (_a = xAxes === null || xAxes === void 0 ? void 0 : xAxes.find(function (a) { return a.id === axisId; })) !== null && _a !== void 0 ? _a : yAxes === null || yAxes === void 0 ? void 0 : yAxes.find(function (a) { return a.id === axisId; })) !== null && _b !== void 0 ? _b : null;
    if (!axis) {
        return undefined;
    }
    return axis;
});
