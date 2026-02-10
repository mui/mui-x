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
exports.computeAxisValue = computeAxisValue;
var axis_1 = require("../../../../models/axis");
var colorScale_1 = require("../../../colorScale");
var ticks_1 = require("../../../ticks");
var getScale_1 = require("../../../getScale");
var dateHelpers_1 = require("../../../dateHelpers");
var getAxisExtremum_1 = require("./getAxisExtremum");
var angleConversion_1 = require("../../../angleConversion");
var getAxisTriggerTooltip_1 = require("./getAxisTriggerTooltip");
var scales_1 = require("../../../scales");
function getRange(drawingArea, axisDirection, axis) {
    if (axisDirection === 'rotation') {
        if (axis.scaleType === 'point') {
            var angles = [
                (0, angleConversion_1.deg2rad)(axis.startAngle, 0),
                (0, angleConversion_1.deg2rad)(axis.endAngle, 2 * Math.PI),
            ];
            var diff = angles[1] - angles[0];
            if (diff > Math.PI * 2 - 0.1) {
                // If we cover a full circle, we remove a slice to avoid having data point at the same place.
                angles[1] -= diff / axis.data.length;
            }
            return angles;
        }
        return [
            (0, angleConversion_1.deg2rad)(axis.startAngle, 0),
            (0, angleConversion_1.deg2rad)(axis.endAngle, 2 * Math.PI),
        ];
    }
    return [0, Math.min(drawingArea.height, drawingArea.width) / 2];
}
var DEFAULT_CATEGORY_GAP_RATIO = 0.2;
var DEFAULT_BAR_GAP_RATIO = 0.1;
function computeAxisValue(_a) {
    var drawingArea = _a.drawingArea, formattedSeries = _a.formattedSeries, allAxis = _a.axis, seriesConfig = _a.seriesConfig, axisDirection = _a.axisDirection;
    if (allAxis === undefined) {
        return {
            axis: {},
            axisIds: [],
        };
    }
    var axisIdsTriggeringTooltip = (0, getAxisTriggerTooltip_1.getAxisTriggerTooltip)(axisDirection, seriesConfig, formattedSeries, allAxis[0].id);
    var completeAxis = {};
    allAxis.forEach(function (eachAxis, axisIndex) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var axis = eachAxis;
        var range = getRange(drawingArea, axisDirection, axis);
        var _m = (0, getAxisExtremum_1.getAxisExtremum)(axis, axisDirection, seriesConfig, axisIndex, formattedSeries), minData = _m[0], maxData = _m[1];
        var triggerTooltip = !axis.ignoreTooltip && axisIdsTriggeringTooltip.has(axis.id);
        var data = (_a = axis.data) !== null && _a !== void 0 ? _a : [];
        if ((0, axis_1.isBandScaleConfig)(axis)) {
            var categoryGapRatio = (_b = axis.categoryGapRatio) !== null && _b !== void 0 ? _b : DEFAULT_CATEGORY_GAP_RATIO;
            var barGapRatio = (_c = axis.barGapRatio) !== null && _c !== void 0 ? _c : DEFAULT_BAR_GAP_RATIO;
            completeAxis[axis.id] = __assign(__assign({ offset: 0, categoryGapRatio: categoryGapRatio, barGapRatio: barGapRatio, triggerTooltip: triggerTooltip }, axis), { data: data, scale: (0, scales_1.scaleBand)(axis.data, range)
                    .paddingInner(categoryGapRatio)
                    .paddingOuter(categoryGapRatio / 2), tickNumber: axis.data.length, colorScale: axis.colorMap &&
                    (axis.colorMap.type === 'ordinal'
                        ? (0, colorScale_1.getOrdinalColorScale)(__assign({ values: axis.data }, axis.colorMap))
                        : (0, colorScale_1.getColorScale)(axis.colorMap)) });
            if ((0, dateHelpers_1.isDateData)(axis.data)) {
                var dateFormatter = (0, dateHelpers_1.createDateFormatter)(axis.data, range, axis.tickNumber);
                completeAxis[axis.id].valueFormatter = (_d = axis.valueFormatter) !== null && _d !== void 0 ? _d : dateFormatter;
            }
        }
        if ((0, axis_1.isPointScaleConfig)(axis)) {
            completeAxis[axis.id] = __assign(__assign({ offset: 0, triggerTooltip: triggerTooltip }, axis), { data: data, scale: (0, scales_1.scalePoint)(axis.data, range), tickNumber: axis.data.length, colorScale: axis.colorMap &&
                    (axis.colorMap.type === 'ordinal'
                        ? (0, colorScale_1.getOrdinalColorScale)(__assign({ values: axis.data }, axis.colorMap))
                        : (0, colorScale_1.getColorScale)(axis.colorMap)) });
            if ((0, dateHelpers_1.isDateData)(axis.data)) {
                var dateFormatter = (0, dateHelpers_1.createDateFormatter)(axis.data, range, axis.tickNumber);
                completeAxis[axis.id].valueFormatter = (_e = axis.valueFormatter) !== null && _e !== void 0 ? _e : dateFormatter;
            }
        }
        if (!(0, axis_1.isContinuousScaleConfig)(axis)) {
            // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
            return;
        }
        var scaleType = (_f = axis.scaleType) !== null && _f !== void 0 ? _f : 'linear';
        var domainLimit = (_g = axis.domainLimit) !== null && _g !== void 0 ? _g : 'nice';
        var axisExtremums = [(_h = axis.min) !== null && _h !== void 0 ? _h : minData, (_j = axis.max) !== null && _j !== void 0 ? _j : maxData];
        if (typeof domainLimit === 'function') {
            var _o = domainLimit(minData, maxData), min = _o.min, max = _o.max;
            axisExtremums[0] = min;
            axisExtremums[1] = max;
        }
        var rawTickNumber = (0, ticks_1.getTickNumber)(axis, axisExtremums, (0, ticks_1.getDefaultTickNumber)(Math.abs(range[1] - range[0])));
        var tickNumber = (0, ticks_1.scaleTickNumberByRange)(rawTickNumber, range);
        var scale = (0, getScale_1.getScale)(scaleType, axisExtremums, range);
        var finalScale = domainLimit === 'nice' ? scale.nice(rawTickNumber) : scale;
        var _p = finalScale.domain(), minDomain = _p[0], maxDomain = _p[1];
        var domain = [(_k = axis.min) !== null && _k !== void 0 ? _k : minDomain, (_l = axis.max) !== null && _l !== void 0 ? _l : maxDomain];
        completeAxis[axis.id] = __assign(__assign({ offset: 0, triggerTooltip: triggerTooltip }, axis), { data: data, scaleType: scaleType, scale: finalScale.domain(domain), tickNumber: tickNumber, colorScale: axis.colorMap && (0, colorScale_1.getColorScale)(axis.colorMap) });
    });
    return {
        axis: completeAxis,
        axisIds: allAxis.map(function (_a) {
            var id = _a.id;
            return id;
        }),
    };
}
