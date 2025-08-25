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
exports.computeAxisValue = computeAxisValue;
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
var defaultValueFormatters_1 = require("../../../defaultValueFormatters");
var axis_1 = require("../../../../models/axis");
var colorScale_1 = require("../../../colorScale");
var ticks_1 = require("../../../ticks");
var getScale_1 = require("../../../getScale");
var dateHelpers_1 = require("../../../dateHelpers");
var zoom_1 = require("./zoom");
var getAxisExtremum_1 = require("./getAxisExtremum");
var getAxisTriggerTooltip_1 = require("./getAxisTriggerTooltip");
var getAxisDomainLimit_1 = require("./getAxisDomainLimit");
function getRange(drawingArea, axisDirection, // | 'rotation' | 'radius',
axis) {
    var range = axisDirection === 'x'
        ? [drawingArea.left, drawingArea.left + drawingArea.width]
        : [drawingArea.top + drawingArea.height, drawingArea.top];
    return axis.reverse ? [range[1], range[0]] : range;
}
var DEFAULT_CATEGORY_GAP_RATIO = 0.2;
var DEFAULT_BAR_GAP_RATIO = 0.1;
function computeAxisValue(_a) {
    var drawingArea = _a.drawingArea, formattedSeries = _a.formattedSeries, allAxis = _a.axis, seriesConfig = _a.seriesConfig, axisDirection = _a.axisDirection, zoomMap = _a.zoomMap, zoomOptions = _a.zoomOptions, getFilters = _a.getFilters, preferStrictDomainInLineCharts = _a.preferStrictDomainInLineCharts;
    if (allAxis === undefined) {
        return {
            axis: {},
            axisIds: [],
        };
    }
    var axisIdsTriggeringTooltip = (0, getAxisTriggerTooltip_1.getAxisTriggerTooltip)(axisDirection, seriesConfig, formattedSeries, allAxis[0].id);
    var completeAxis = {};
    allAxis.forEach(function (eachAxis, axisIndex) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var axis = eachAxis;
        var zoomOption = zoomOptions === null || zoomOptions === void 0 ? void 0 : zoomOptions[axis.id];
        var zoom = zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axis.id);
        var zoomRange = zoom ? [zoom.start, zoom.end] : [0, 100];
        var range = getRange(drawingArea, axisDirection, axis);
        var _o = (0, getAxisExtremum_1.getAxisExtremum)(axis, axisDirection, seriesConfig, axisIndex, formattedSeries, zoom === undefined && !zoomOption ? getFilters : undefined), minData = _o[0], maxData = _o[1];
        var triggerTooltip = !axis.ignoreTooltip && axisIdsTriggeringTooltip.has(axis.id);
        var data = (_a = axis.data) !== null && _a !== void 0 ? _a : [];
        if ((0, axis_1.isBandScaleConfig)(axis)) {
            var categoryGapRatio = (_b = axis.categoryGapRatio) !== null && _b !== void 0 ? _b : DEFAULT_CATEGORY_GAP_RATIO;
            var barGapRatio = (_c = axis.barGapRatio) !== null && _c !== void 0 ? _c : DEFAULT_BAR_GAP_RATIO;
            // Reverse range because ordinal scales are presented from top to bottom on y-axis
            var scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;
            var zoomedRange_1 = (0, zoom_1.zoomScaleRange)(scaleRange, zoomRange);
            completeAxis[axis.id] = __assign(__assign({ offset: 0, height: 0, categoryGapRatio: categoryGapRatio, barGapRatio: barGapRatio, triggerTooltip: triggerTooltip }, axis), { data: data, scale: (0, d3_scale_1.scaleBand)(axis.data, zoomedRange_1)
                    .paddingInner(categoryGapRatio)
                    .paddingOuter(categoryGapRatio / 2), tickNumber: axis.data.length, colorScale: axis.colorMap &&
                    (axis.colorMap.type === 'ordinal'
                        ? (0, colorScale_1.getOrdinalColorScale)(__assign({ values: axis.data }, axis.colorMap))
                        : (0, colorScale_1.getColorScale)(axis.colorMap)) });
            if ((0, dateHelpers_1.isDateData)(axis.data)) {
                var dateFormatter = (0, dateHelpers_1.createDateFormatter)(axis, scaleRange);
                completeAxis[axis.id].valueFormatter = (_d = axis.valueFormatter) !== null && _d !== void 0 ? _d : dateFormatter;
            }
        }
        if ((0, axis_1.isPointScaleConfig)(axis)) {
            var scaleRange = axisDirection === 'y' ? __spreadArray([], range, true).reverse() : range;
            var zoomedRange_2 = (0, zoom_1.zoomScaleRange)(scaleRange, zoomRange);
            completeAxis[axis.id] = __assign(__assign({ offset: 0, height: 0, triggerTooltip: triggerTooltip }, axis), { data: data, scale: (0, d3_scale_1.scalePoint)(axis.data, zoomedRange_2), tickNumber: axis.data.length, colorScale: axis.colorMap &&
                    (axis.colorMap.type === 'ordinal'
                        ? (0, colorScale_1.getOrdinalColorScale)(__assign({ values: axis.data }, axis.colorMap))
                        : (0, colorScale_1.getColorScale)(axis.colorMap)) });
            if ((0, dateHelpers_1.isDateData)(axis.data)) {
                var dateFormatter = (0, dateHelpers_1.createDateFormatter)(axis, scaleRange);
                completeAxis[axis.id].valueFormatter = (_e = axis.valueFormatter) !== null && _e !== void 0 ? _e : dateFormatter;
            }
        }
        if (axis.scaleType === 'band' || axis.scaleType === 'point') {
            // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
            return;
        }
        var scaleType = (_f = axis.scaleType) !== null && _f !== void 0 ? _f : 'linear';
        var domainLimit = preferStrictDomainInLineCharts
            ? (0, getAxisDomainLimit_1.getAxisDomainLimit)(axis, axisDirection, axisIndex, formattedSeries)
            : ((_g = axis.domainLimit) !== null && _g !== void 0 ? _g : 'nice');
        var axisExtremums = [(_h = axis.min) !== null && _h !== void 0 ? _h : minData, (_j = axis.max) !== null && _j !== void 0 ? _j : maxData];
        if (typeof domainLimit === 'function') {
            var _p = domainLimit(minData, maxData), min = _p.min, max = _p.max;
            axisExtremums[0] = min;
            axisExtremums[1] = max;
        }
        var rawTickNumber = (0, ticks_1.getTickNumber)(__assign(__assign({}, axis), { range: range, domain: axisExtremums }));
        var tickNumber = (0, ticks_1.scaleTickNumberByRange)(rawTickNumber, zoomRange);
        var zoomedRange = (0, zoom_1.zoomScaleRange)(range, zoomRange);
        var scale = (0, getScale_1.getScale)(scaleType, axisExtremums, zoomedRange);
        if ((0, axis_1.isSymlogScaleConfig)(axis) && axis.constant != null) {
            scale.constant(axis.constant);
        }
        var finalScale = domainLimit === 'nice' ? scale.nice(rawTickNumber) : scale;
        var _q = finalScale.domain(), minDomain = _q[0], maxDomain = _q[1];
        var domain = [(_k = axis.min) !== null && _k !== void 0 ? _k : minDomain, (_l = axis.max) !== null && _l !== void 0 ? _l : maxDomain];
        completeAxis[axis.id] = __assign(__assign({ offset: 0, height: 0, triggerTooltip: triggerTooltip }, axis), { data: data, scaleType: scaleType, scale: finalScale.domain(domain), tickNumber: tickNumber, colorScale: axis.colorMap && (0, colorScale_1.getColorScale)(axis.colorMap), valueFormatter: (_m = axis.valueFormatter) !== null && _m !== void 0 ? _m : (0, defaultValueFormatters_1.createScalarFormatter)(tickNumber, (0, getScale_1.getScale)(scaleType, range.map(function (v) { return scale.invert(v); }), range)) });
    });
    return {
        axis: completeAxis,
        axisIds: allAxis.map(function (_a) {
            var id = _a.id;
            return id;
        }),
    };
}
