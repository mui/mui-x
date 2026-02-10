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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartSeriesFlatbushMap = exports.selectorChartSeriesEmptyFlatbushMap = exports.selectorChartDefaultYAxisId = exports.selectorChartDefaultXAxisId = exports.selectorChartRawAxis = exports.selectorChartAxis = exports.selectorChartYAxis = exports.selectorChartXAxis = exports.selectorChartYScales = exports.selectorChartXScales = exports.selectorChartNormalizedYScales = exports.selectorChartNormalizedXScales = exports.selectorChartFilteredYDomains = exports.selectorChartFilteredXDomains = exports.selectorChartZoomAxisFilters = exports.selectorChartYAxisWithDomains = exports.selectorChartXAxisWithDomains = exports.selectorDefaultYAxisTickNumber = exports.selectorDefaultXAxisTickNumber = exports.selectorChartAxisZoomOptionsLookup = exports.selectorChartZoomOptionsLookup = exports.selectorChartAxisZoomData = exports.selectorChartZoomMap = exports.selectorChartZoomIsInteracting = exports.createZoomMap = void 0;
var store_1 = require("@mui/x-internals/store");
var useChartDimensions_1 = require("../../corePlugins/useChartDimensions");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var computeAxisValue_1 = require("./computeAxisValue");
var createAxisFilterMapper_1 = require("./createAxisFilterMapper");
var createZoomLookup_1 = require("./createZoomLookup");
var axis_1 = require("../../../../models/axis");
var useChartCartesianAxisLayout_selectors_1 = require("./useChartCartesianAxisLayout.selectors");
var useChartExperimentalFeature_1 = require("../../corePlugins/useChartExperimentalFeature");
var ticks_1 = require("../../../ticks");
var getAxisScale_1 = require("./getAxisScale");
var scaleGuards_1 = require("../../../scaleGuards");
var zoom_1 = require("./zoom");
var getAxisExtrema_1 = require("./getAxisExtrema");
var domain_1 = require("./domain");
var Flatbush_1 = require("../../../Flatbush");
var useChartSeriesConfig_1 = require("../../corePlugins/useChartSeriesConfig");
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
exports.selectorChartZoomIsInteracting = (0, store_1.createSelector)(selectorChartZoomState, function (zoom) { return zoom === null || zoom === void 0 ? void 0 : zoom.isInteracting; });
exports.selectorChartZoomMap = (0, store_1.createSelectorMemoized)(selectorChartZoomState, function selectorChartZoomMap(zoom) {
    return (zoom === null || zoom === void 0 ? void 0 : zoom.zoomData) && (0, exports.createZoomMap)(zoom === null || zoom === void 0 ? void 0 : zoom.zoomData);
});
exports.selectorChartAxisZoomData = (0, store_1.createSelector)(exports.selectorChartZoomMap, function (zoomMap, axisId) { return zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axisId); });
exports.selectorChartZoomOptionsLookup = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, function selectorChartZoomOptionsLookup(xAxis, yAxis) {
    return __assign(__assign({}, (0, createZoomLookup_1.createZoomLookup)('x')(xAxis)), (0, createZoomLookup_1.createZoomLookup)('y')(yAxis));
});
exports.selectorChartAxisZoomOptionsLookup = (0, store_1.createSelector)(exports.selectorChartZoomOptionsLookup, function (axisLookup, axisId) { return axisLookup[axisId]; });
exports.selectorDefaultXAxisTickNumber = (0, store_1.createSelector)(useChartDimensions_1.selectorChartDrawingArea, function selectorDefaultXAxisTickNumber(drawingArea) {
    return (0, ticks_1.getDefaultTickNumber)(drawingArea.width);
});
exports.selectorDefaultYAxisTickNumber = (0, store_1.createSelector)(useChartDimensions_1.selectorChartDrawingArea, function selectorDefaultYAxisTickNumber(drawingArea) {
    return (0, ticks_1.getDefaultTickNumber)(drawingArea.height);
});
exports.selectorChartXAxisWithDomains = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartSeries_1.selectorChartSeriesProcessed, useChartSeriesConfig_1.selectorChartSeriesConfig, useChartExperimentalFeature_1.selectorPreferStrictDomainInLineCharts, exports.selectorDefaultXAxisTickNumber, function selectorChartXAxisWithDomains(axes, formattedSeries, seriesConfig, preferStrictDomainInLineCharts, defaultTickNumber) {
    var axisDirection = 'x';
    var domains = {};
    axes === null || axes === void 0 ? void 0 : axes.forEach(function (eachAxis, axisIndex) {
        var _a, _b;
        var axis = eachAxis;
        if ((0, axis_1.isBandScaleConfig)(axis) || (0, axis_1.isPointScaleConfig)(axis)) {
            domains[axis.id] = { domain: axis.data };
            if (axis.ordinalTimeTicks !== undefined) {
                domains[axis.id].tickNumber = (0, ticks_1.getTickNumber)(axis, [(_a = axis.data) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d !== null; }), (_b = axis.data) === null || _b === void 0 ? void 0 : _b.findLast(function (d) { return d !== null; })], defaultTickNumber);
            }
            return;
        }
        var axisExtrema = (0, getAxisExtrema_1.getAxisExtrema)(axis, axisDirection, seriesConfig, axisIndex, formattedSeries);
        domains[axis.id] = (0, domain_1.calculateInitialDomainAndTickNumber)(axis, 'x', axisIndex, formattedSeries, axisExtrema, defaultTickNumber, preferStrictDomainInLineCharts);
    });
    return { axes: axes, domains: domains };
});
exports.selectorChartYAxisWithDomains = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, useChartSeries_1.selectorChartSeriesProcessed, useChartSeriesConfig_1.selectorChartSeriesConfig, useChartExperimentalFeature_1.selectorPreferStrictDomainInLineCharts, exports.selectorDefaultYAxisTickNumber, function selectorChartYAxisWithDomains(axes, formattedSeries, seriesConfig, preferStrictDomainInLineCharts, defaultTickNumber) {
    var axisDirection = 'y';
    var domains = {};
    axes === null || axes === void 0 ? void 0 : axes.forEach(function (eachAxis, axisIndex) {
        var _a, _b;
        var axis = eachAxis;
        if ((0, axis_1.isBandScaleConfig)(axis) || (0, axis_1.isPointScaleConfig)(axis)) {
            domains[axis.id] = { domain: axis.data };
            if (axis.ordinalTimeTicks !== undefined) {
                domains[axis.id].tickNumber = (0, ticks_1.getTickNumber)(axis, [(_a = axis.data) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d !== null; }), (_b = axis.data) === null || _b === void 0 ? void 0 : _b.findLast(function (d) { return d !== null; })], defaultTickNumber);
            }
            return;
        }
        var axisExtrema = (0, getAxisExtrema_1.getAxisExtrema)(axis, axisDirection, seriesConfig, axisIndex, formattedSeries);
        domains[axis.id] = (0, domain_1.calculateInitialDomainAndTickNumber)(axis, 'y', axisIndex, formattedSeries, axisExtrema, defaultTickNumber, preferStrictDomainInLineCharts);
    });
    return { axes: axes, domains: domains };
});
exports.selectorChartZoomAxisFilters = (0, store_1.createSelectorMemoized)(exports.selectorChartZoomMap, exports.selectorChartZoomOptionsLookup, exports.selectorChartXAxisWithDomains, exports.selectorChartYAxisWithDomains, function selectorChartZoomAxisFilters(zoomMap, zoomOptions, _a, _b) {
    var _c;
    var xAxis = _a.axes, xDomains = _a.domains;
    var yAxis = _b.axes, yDomains = _b.domains;
    if (!zoomMap || !zoomOptions) {
        return undefined;
    }
    var hasFilter = false;
    var filters = {};
    var axes = __spreadArray(__spreadArray([], (xAxis !== null && xAxis !== void 0 ? xAxis : []), true), (yAxis !== null && yAxis !== void 0 ? yAxis : []), true);
    for (var i = 0; i < axes.length; i += 1) {
        var axis = axes[i];
        if (!zoomOptions[axis.id] || zoomOptions[axis.id].filterMode !== 'discard') {
            continue;
        }
        var zoom = zoomMap.get(axis.id);
        if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
            // No zoom, or zoom with all data visible
            continue;
        }
        var axisDirection = i < ((_c = xAxis === null || xAxis === void 0 ? void 0 : xAxis.length) !== null && _c !== void 0 ? _c : 0) ? 'x' : 'y';
        if (axis.scaleType === 'band' || axis.scaleType === 'point') {
            filters[axis.id] = (0, createAxisFilterMapper_1.createDiscreteScaleGetAxisFilter)(axis.data, zoom.start, zoom.end, axisDirection);
        }
        else {
            var domain = (axisDirection === 'x' ? xDomains[axis.id] : yDomains[axis.id]).domain;
            filters[axis.id] = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(
            // For continuous scales, the domain is always a two-value array.
            domain, zoom.start, zoom.end, axisDirection, axis.data);
        }
        hasFilter = true;
    }
    if (!hasFilter) {
        return undefined;
    }
    return (0, createAxisFilterMapper_1.createGetAxisFilters)(filters);
});
exports.selectorChartFilteredXDomains = (0, store_1.createSelectorMemoized)(useChartSeries_1.selectorChartSeriesProcessed, useChartSeriesConfig_1.selectorChartSeriesConfig, exports.selectorChartZoomMap, exports.selectorChartZoomOptionsLookup, exports.selectorChartZoomAxisFilters, useChartExperimentalFeature_1.selectorPreferStrictDomainInLineCharts, exports.selectorChartXAxisWithDomains, function selectorChartFilteredXDomains(formattedSeries, seriesConfig, zoomMap, zoomOptions, getFilters, preferStrictDomainInLineCharts, _a) {
    var axes = _a.axes, domains = _a.domains;
    var filteredDomains = {};
    axes === null || axes === void 0 ? void 0 : axes.forEach(function (axis, axisIndex) {
        var domain = domains[axis.id].domain;
        if ((0, axis_1.isBandScaleConfig)(axis) || (0, axis_1.isPointScaleConfig)(axis)) {
            filteredDomains[axis.id] = domain;
            return;
        }
        var zoom = zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axis.id);
        var zoomOption = zoomOptions === null || zoomOptions === void 0 ? void 0 : zoomOptions[axis.id];
        var filter = zoom === undefined && !zoomOption ? getFilters : undefined; // Do not apply filtering if zoom is already defined.
        if (!filter) {
            filteredDomains[axis.id] = domain;
            return;
        }
        var rawTickNumber = domains[axis.id].tickNumber;
        var axisExtrema = (0, getAxisExtrema_1.getAxisExtrema)(axis, 'x', seriesConfig, axisIndex, formattedSeries, filter);
        filteredDomains[axis.id] = (0, domain_1.calculateFinalDomain)(axis, 'x', axisIndex, formattedSeries, axisExtrema, rawTickNumber, preferStrictDomainInLineCharts);
    });
    return filteredDomains;
});
exports.selectorChartFilteredYDomains = (0, store_1.createSelectorMemoized)(useChartSeries_1.selectorChartSeriesProcessed, useChartSeriesConfig_1.selectorChartSeriesConfig, exports.selectorChartZoomMap, exports.selectorChartZoomOptionsLookup, exports.selectorChartZoomAxisFilters, useChartExperimentalFeature_1.selectorPreferStrictDomainInLineCharts, exports.selectorChartYAxisWithDomains, function selectorChartFilteredYDomains(formattedSeries, seriesConfig, zoomMap, zoomOptions, getFilters, preferStrictDomainInLineCharts, _a) {
    var axes = _a.axes, domains = _a.domains;
    var filteredDomains = {};
    axes === null || axes === void 0 ? void 0 : axes.forEach(function (axis, axisIndex) {
        var domain = domains[axis.id].domain;
        if ((0, axis_1.isBandScaleConfig)(axis) || (0, axis_1.isPointScaleConfig)(axis)) {
            filteredDomains[axis.id] = domain;
            return;
        }
        var zoom = zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axis.id);
        var zoomOption = zoomOptions === null || zoomOptions === void 0 ? void 0 : zoomOptions[axis.id];
        var filter = zoom === undefined && !zoomOption ? getFilters : undefined; // Do not apply filtering if zoom is already defined.
        if (!filter) {
            filteredDomains[axis.id] = domain;
            return;
        }
        var rawTickNumber = domains[axis.id].tickNumber;
        var axisExtrema = (0, getAxisExtrema_1.getAxisExtrema)(axis, 'y', seriesConfig, axisIndex, formattedSeries, filter);
        filteredDomains[axis.id] = (0, domain_1.calculateFinalDomain)(axis, 'y', axisIndex, formattedSeries, axisExtrema, rawTickNumber, preferStrictDomainInLineCharts);
    });
    return filteredDomains;
});
exports.selectorChartNormalizedXScales = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, exports.selectorChartFilteredXDomains, function selectorChartNormalizedXScales(axes, filteredDomains) {
    var scales = {};
    axes === null || axes === void 0 ? void 0 : axes.forEach(function (eachAxis) {
        var axis = eachAxis;
        var domain = filteredDomains[axis.id];
        scales[axis.id] = (0, getAxisScale_1.getNormalizedAxisScale)(axis, domain);
    });
    return scales;
});
exports.selectorChartNormalizedYScales = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, exports.selectorChartFilteredYDomains, function selectorChartNormalizedYScales(axes, filteredDomains) {
    var scales = {};
    axes === null || axes === void 0 ? void 0 : axes.forEach(function (eachAxis) {
        var axis = eachAxis;
        var domain = filteredDomains[axis.id];
        scales[axis.id] = (0, getAxisScale_1.getNormalizedAxisScale)(axis, domain);
    });
    return scales;
});
exports.selectorChartXScales = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, exports.selectorChartNormalizedXScales, useChartDimensions_1.selectorChartDrawingArea, exports.selectorChartZoomMap, function selectorChartXScales(axes, normalizedScales, drawingArea, zoomMap) {
    var scales = {};
    axes === null || axes === void 0 ? void 0 : axes.forEach(function (eachAxis) {
        var axis = eachAxis;
        var zoom = zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axis.id);
        var zoomRange = zoom ? [zoom.start, zoom.end] : [0, 100];
        var range = (0, getAxisScale_1.getRange)(drawingArea, 'x', axis);
        var scale = normalizedScales[axis.id].copy();
        var zoomedRange = (0, zoom_1.zoomScaleRange)(range, zoomRange);
        scale.range(zoomedRange);
        scales[axis.id] = scale;
    });
    return scales;
});
exports.selectorChartYScales = (0, store_1.createSelectorMemoized)(useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, exports.selectorChartNormalizedYScales, useChartDimensions_1.selectorChartDrawingArea, exports.selectorChartZoomMap, function selectorChartYScales(axes, normalizedScales, drawingArea, zoomMap) {
    var scales = {};
    axes === null || axes === void 0 ? void 0 : axes.forEach(function (eachAxis) {
        var axis = eachAxis;
        var zoom = zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axis.id);
        var zoomRange = zoom ? [zoom.start, zoom.end] : [0, 100];
        var range = (0, getAxisScale_1.getRange)(drawingArea, 'y', axis);
        var scale = normalizedScales[axis.id].copy();
        var scaleRange = (0, scaleGuards_1.isOrdinalScale)(scale) ? range.reverse() : range;
        var zoomedRange = (0, zoom_1.zoomScaleRange)(scaleRange, zoomRange);
        scale.range(zoomedRange);
        scales[axis.id] = scale;
    });
    return scales;
});
/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */
exports.selectorChartXAxis = (0, store_1.createSelectorMemoized)(useChartDimensions_1.selectorChartDrawingArea, useChartSeries_1.selectorChartSeriesProcessed, useChartSeriesConfig_1.selectorChartSeriesConfig, exports.selectorChartZoomMap, exports.selectorChartXAxisWithDomains, exports.selectorChartXScales, function selectorChartXAxis(drawingArea, formattedSeries, seriesConfig, zoomMap, _a, scales) {
    var axes = _a.axes, domains = _a.domains;
    return (0, computeAxisValue_1.computeAxisValue)({
        scales: scales,
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axes,
        seriesConfig: seriesConfig,
        axisDirection: 'x',
        zoomMap: zoomMap,
        domains: domains,
    });
});
exports.selectorChartYAxis = (0, store_1.createSelectorMemoized)(useChartDimensions_1.selectorChartDrawingArea, useChartSeries_1.selectorChartSeriesProcessed, useChartSeriesConfig_1.selectorChartSeriesConfig, exports.selectorChartZoomMap, exports.selectorChartYAxisWithDomains, exports.selectorChartYScales, function selectorChartYAxis(drawingArea, formattedSeries, seriesConfig, zoomMap, _a, scales) {
    var axes = _a.axes, domains = _a.domains;
    return (0, computeAxisValue_1.computeAxisValue)({
        scales: scales,
        drawingArea: drawingArea,
        formattedSeries: formattedSeries,
        axis: axes,
        seriesConfig: seriesConfig,
        axisDirection: 'y',
        zoomMap: zoomMap,
        domains: domains,
    });
});
exports.selectorChartAxis = (0, store_1.createSelector)(exports.selectorChartXAxis, exports.selectorChartYAxis, function (xAxes, yAxes, axisId) { var _a; return (_a = xAxes === null || xAxes === void 0 ? void 0 : xAxes.axis[axisId]) !== null && _a !== void 0 ? _a : yAxes === null || yAxes === void 0 ? void 0 : yAxes.axis[axisId]; });
exports.selectorChartRawAxis = (0, store_1.createSelector)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, function (xAxes, yAxes, axisId) {
    var _a, _b;
    var axis = (_b = (_a = xAxes === null || xAxes === void 0 ? void 0 : xAxes.find(function (a) { return a.id === axisId; })) !== null && _a !== void 0 ? _a : yAxes === null || yAxes === void 0 ? void 0 : yAxes.find(function (a) { return a.id === axisId; })) !== null && _b !== void 0 ? _b : null;
    if (!axis) {
        return undefined;
    }
    return axis;
});
exports.selectorChartDefaultXAxisId = (0, store_1.createSelector)(useChartCartesianAxisLayout_selectors_1.selectorChartRawXAxis, function (xAxes) { return xAxes[0].id; });
exports.selectorChartDefaultYAxisId = (0, store_1.createSelector)(useChartCartesianAxisLayout_selectors_1.selectorChartRawYAxis, function (yAxes) { return yAxes[0].id; });
var EMPTY_MAP = new Map();
var selectorChartSeriesEmptyFlatbushMap = function () { return EMPTY_MAP; };
exports.selectorChartSeriesEmptyFlatbushMap = selectorChartSeriesEmptyFlatbushMap;
exports.selectorChartSeriesFlatbushMap = (0, store_1.createSelectorMemoized)(useChartSeries_1.selectorChartSeriesProcessed, exports.selectorChartNormalizedXScales, exports.selectorChartNormalizedYScales, exports.selectorChartDefaultXAxisId, exports.selectorChartDefaultYAxisId, function selectChartSeriesFlatbushMap(allSeries, xAxesScaleMap, yAxesScaleMap, defaultXAxisId, defaultYAxisId) {
    // FIXME: Do we want to support non-scatter series here?
    var validSeries = allSeries.scatter;
    var flatbushMap = new Map();
    if (!validSeries) {
        return flatbushMap;
    }
    validSeries.seriesOrder.forEach(function (seriesId) {
        var _a = validSeries.series[seriesId], data = _a.data, _b = _a.xAxisId, xAxisId = _b === void 0 ? defaultXAxisId : _b, _c = _a.yAxisId, yAxisId = _c === void 0 ? defaultYAxisId : _c;
        var flatbush = new Flatbush_1.Flatbush(data.length);
        var originalXScale = xAxesScaleMap[xAxisId];
        var originalYScale = yAxesScaleMap[yAxisId];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var datum = data_1[_i];
            // Add the points using a [0, 1] range so that we don't need to recreate the Flatbush structure when zooming.
            // This doesn't happen in practice, though, because currently the scales depend on the drawing area.
            flatbush.add(originalXScale(datum.x), originalYScale(datum.y));
        }
        flatbush.finish();
        flatbushMap.set(seriesId, flatbush);
    });
    return flatbushMap;
});
