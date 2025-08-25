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
exports.yRangeGetter = exports.xRangeGetter = void 0;
exports.computeAxisValue = computeAxisValue;
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
var internals_1 = require("@mui/x-charts/internals");
var xRangeGetter = function (drawingArea, reverse, removedSpace) {
    if (removedSpace === void 0) { removedSpace = 0; }
    var range = [
        drawingArea.left,
        drawingArea.left + drawingArea.width - removedSpace,
    ];
    return reverse ? [range[1], range[0]] : [range[0], range[1]];
};
exports.xRangeGetter = xRangeGetter;
var yRangeGetter = function (drawingArea, reverse, removedSpace) {
    if (removedSpace === void 0) { removedSpace = 0; }
    var range = [
        drawingArea.top + drawingArea.height - removedSpace,
        drawingArea.top,
    ];
    return reverse ? [range[1], range[0]] : [range[0], range[1]];
};
exports.yRangeGetter = yRangeGetter;
function getRange(drawingArea, axisDirection, axis, removedSpace) {
    if (removedSpace === void 0) { removedSpace = 0; }
    return axisDirection === 'x'
        ? (0, exports.xRangeGetter)(drawingArea, axis.reverse, removedSpace)
        : (0, exports.yRangeGetter)(drawingArea, axis.reverse, removedSpace);
}
function computeAxisValue(_a) {
    var drawingArea = _a.drawingArea, formattedSeries = _a.formattedSeries, allAxis = _a.axis, seriesConfig = _a.seriesConfig, axisDirection = _a.axisDirection, gap = _a.gap;
    if (allAxis === undefined) {
        return {
            axis: {},
            axisIds: [],
        };
    }
    var axisIdsTriggeringTooltip = (0, internals_1.getCartesianAxisTriggerTooltip)(axisDirection, seriesConfig, formattedSeries, allAxis[0].id);
    var completeAxis = {};
    allAxis.forEach(function (eachAxis, axisIndex) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var axis = eachAxis;
        var range = getRange(drawingArea, axisDirection, axis);
        var _o = (0, internals_1.getAxisExtremum)(axis, axisDirection, seriesConfig, axisIndex, formattedSeries), minData = _o[0], maxData = _o[1];
        var triggerTooltip = !axis.ignoreTooltip && axisIdsTriggeringTooltip.has(axis.id);
        var data = (_a = axis.data) !== null && _a !== void 0 ? _a : [];
        if ((0, internals_1.isBandScaleConfig)(axis)) {
            // Reverse range because ordinal scales are presented from top to bottom on y-axis
            var scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;
            var rangeSpace = Math.abs(range[1] - range[0]);
            var N = axis.data.length;
            var bandWidth = (rangeSpace - gap * (N - 1)) / N;
            var step = bandWidth + gap;
            completeAxis[axis.id] = __assign(__assign({ offset: 0, height: 0, categoryGapRatio: 0, barGapRatio: 0, triggerTooltip: triggerTooltip }, axis), { data: data, scale: (0, d3_scale_1.scaleBand)(axis.data, scaleRange)
                    .paddingInner(gap / step)
                    .paddingOuter(0), tickNumber: axis.data.length, colorScale: axis.colorMap &&
                    (axis.colorMap.type === 'ordinal'
                        ? (0, internals_1.getOrdinalColorScale)(__assign({ values: axis.data }, axis.colorMap))
                        : (0, internals_1.getColorScale)(axis.colorMap)) });
            if ((0, internals_1.isDateData)(axis.data)) {
                var dateFormatter = (0, internals_1.createDateFormatter)(axis, scaleRange);
                completeAxis[axis.id].valueFormatter = (_b = axis.valueFormatter) !== null && _b !== void 0 ? _b : dateFormatter;
            }
        }
        if (axis.scaleType === 'band') {
            return;
        }
        if (axis.scaleType === 'point') {
            throw new Error('Point scale is not supported in FunnelChart. Please use band scale instead.');
        }
        var isHorizontal = Object.values((_d = (_c = formattedSeries.funnel) === null || _c === void 0 ? void 0 : _c.series) !== null && _d !== void 0 ? _d : {}).some(function (s) { return s.layout === 'horizontal'; });
        if (isHorizontal ? axisDirection === 'x' : axisDirection === 'y') {
            // For linear scale replacing the band scale, we remove the space needed for gap from the scale range.
            var itemNumber = (_f = (_e = formattedSeries.funnel) === null || _e === void 0 ? void 0 : _e.series[formattedSeries.funnel.seriesOrder[0]].data.length) !== null && _f !== void 0 ? _f : 0;
            var spaceToRemove = gap * (itemNumber - 1);
            range = getRange(drawingArea, axisDirection, axis, spaceToRemove);
        }
        var scaleType = (_g = axis.scaleType) !== null && _g !== void 0 ? _g : 'linear';
        var domainLimit = (_h = axis.domainLimit) !== null && _h !== void 0 ? _h : 'nice';
        var axisExtremums = [(_j = axis.min) !== null && _j !== void 0 ? _j : minData, (_k = axis.max) !== null && _k !== void 0 ? _k : maxData];
        if (typeof domainLimit === 'function') {
            var _p = domainLimit(minData, maxData), min = _p.min, max = _p.max;
            axisExtremums[0] = min;
            axisExtremums[1] = max;
        }
        var rawTickNumber = (0, internals_1.getTickNumber)(__assign(__assign({}, axis), { range: range, domain: axisExtremums }));
        var tickNumber = (0, internals_1.scaleTickNumberByRange)(rawTickNumber, range);
        var scale = (0, internals_1.getScale)(scaleType, axisExtremums, range);
        var finalScale = domainLimit === 'nice' ? scale.nice(rawTickNumber) : scale;
        var _q = finalScale.domain(), minDomain = _q[0], maxDomain = _q[1];
        var domain = [(_l = axis.min) !== null && _l !== void 0 ? _l : minDomain, (_m = axis.max) !== null && _m !== void 0 ? _m : maxDomain];
        completeAxis[axis.id] = __assign(__assign({ offset: 0, height: 0, triggerTooltip: triggerTooltip }, axis), { data: data, scaleType: scaleType, scale: finalScale.domain(domain), tickNumber: tickNumber, colorScale: axis.colorMap && (0, internals_1.getColorScale)(axis.colorMap) });
    });
    return {
        axis: completeAxis,
        axisIds: allAxis.map(function (_a) {
            var id = _a.id;
            return id;
        }),
    };
}
