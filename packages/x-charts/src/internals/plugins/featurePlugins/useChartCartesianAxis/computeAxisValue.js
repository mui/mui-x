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
var defaultValueFormatters_1 = require("../../../defaultValueFormatters");
var axis_1 = require("../../../../models/axis");
var colorScale_1 = require("../../../colorScale");
var ticks_1 = require("../../../ticks");
var getScale_1 = require("../../../getScale");
var dateHelpers_1 = require("../../../dateHelpers");
var getAxisTriggerTooltip_1 = require("./getAxisTriggerTooltip");
var scaleGuards_1 = require("../../../scaleGuards");
function getRange(drawingArea, axisDirection, // | 'rotation' | 'radius',
reverse) {
    var range = axisDirection === 'x'
        ? [drawingArea.left, drawingArea.left + drawingArea.width]
        : [drawingArea.top + drawingArea.height, drawingArea.top];
    return reverse ? [range[1], range[0]] : range;
}
function shouldIgnoreGapRatios(scale, categoryGapRatio) {
    var step = scale.step();
    var paddingPx = step * categoryGapRatio;
    /* If the padding is less than 0.1px, we consider it negligible and ignore it.
     * This prevents issues where very small gaps cause rendering artifacts or unexpected layouts.
     * A threshold of 0.1px is chosen as it's generally below the perceptible limit for most displays.
     */
    return paddingPx < 0.1;
}
var DEFAULT_CATEGORY_GAP_RATIO = 0.2;
var DEFAULT_BAR_GAP_RATIO = 0.1;
function computeAxisValue(_a) {
    var scales = _a.scales, drawingArea = _a.drawingArea, formattedSeries = _a.formattedSeries, allAxis = _a.axis, seriesConfig = _a.seriesConfig, axisDirection = _a.axisDirection, zoomMap = _a.zoomMap, domains = _a.domains;
    if (allAxis === undefined) {
        return {
            axis: {},
            axisIds: [],
        };
    }
    var axisIdsTriggeringTooltip = (0, getAxisTriggerTooltip_1.getAxisTriggerTooltip)(axisDirection, seriesConfig, formattedSeries, allAxis[0].id);
    var completeAxis = {};
    allAxis.forEach(function (eachAxis) {
        var _a, _b, _c, _d, _e, _f, _g;
        var axis = eachAxis;
        var scale = scales[axis.id];
        var zoom = zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axis.id);
        var zoomRange = zoom ? [zoom.start, zoom.end] : [0, 100];
        var range = getRange(drawingArea, axisDirection, (_a = axis.reverse) !== null && _a !== void 0 ? _a : false);
        var rawTickNumber = domains[axis.id].tickNumber;
        var triggerTooltip = !axis.ignoreTooltip && axisIdsTriggeringTooltip.has(axis.id);
        var tickNumber = (0, ticks_1.scaleTickNumberByRange)(rawTickNumber, zoomRange);
        var data = (_b = axis.data) !== null && _b !== void 0 ? _b : [];
        if ((0, scaleGuards_1.isOrdinalScale)(scale)) {
            // Reverse range because ordinal scales are presented from top to bottom on y-axis
            var scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;
            if ((0, scaleGuards_1.isBandScale)(scale) && (0, axis_1.isBandScaleConfig)(axis)) {
                var desiredCategoryGapRatio = (_c = axis.categoryGapRatio) !== null && _c !== void 0 ? _c : DEFAULT_CATEGORY_GAP_RATIO;
                var ignoreGapRatios = shouldIgnoreGapRatios(scale, desiredCategoryGapRatio);
                var categoryGapRatio = ignoreGapRatios ? 0 : desiredCategoryGapRatio;
                var barGapRatio = ignoreGapRatios ? 0 : ((_d = axis.barGapRatio) !== null && _d !== void 0 ? _d : DEFAULT_BAR_GAP_RATIO);
                completeAxis[axis.id] = __assign(__assign({ offset: 0, height: 0, categoryGapRatio: categoryGapRatio, barGapRatio: barGapRatio, triggerTooltip: triggerTooltip }, axis), { data: data, 
                    /* Doing this here is technically wrong, but acceptable in practice.
                     * In theory, this should be done in the normalized scale selector, but then we'd need that selector to depend
                     * on the zoom range, which would void its goal (which is to be independent of zoom).
                     * Since we only ignore gap ratios when they're practically invisible, the small errors caused by this
                     * discrepancy will hopefully not be noticeable. */
                    scale: ignoreGapRatios ? scale.copy().padding(0) : scale, tickNumber: tickNumber, colorScale: axis.colorMap &&
                        (axis.colorMap.type === 'ordinal'
                            ? (0, colorScale_1.getOrdinalColorScale)(__assign({ values: axis.data }, axis.colorMap))
                            : (0, colorScale_1.getColorScale)(axis.colorMap)) });
            }
            if ((0, axis_1.isPointScaleConfig)(axis)) {
                completeAxis[axis.id] = __assign(__assign({ offset: 0, height: 0, triggerTooltip: triggerTooltip }, axis), { data: data, scale: scale, tickNumber: tickNumber, colorScale: axis.colorMap &&
                        (axis.colorMap.type === 'ordinal'
                            ? (0, colorScale_1.getOrdinalColorScale)(__assign({ values: axis.data }, axis.colorMap))
                            : (0, colorScale_1.getColorScale)(axis.colorMap)) });
            }
            if ((0, dateHelpers_1.isDateData)(axis.data)) {
                var dateFormatter = (0, dateHelpers_1.createDateFormatter)(axis.data, scaleRange, axis.tickNumber);
                completeAxis[axis.id].valueFormatter = (_e = axis.valueFormatter) !== null && _e !== void 0 ? _e : dateFormatter;
            }
            return;
        }
        if (axis.scaleType === 'band' || axis.scaleType === 'point') {
            // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
            return;
        }
        var continuousAxis = axis;
        var scaleType = (_f = continuousAxis.scaleType) !== null && _f !== void 0 ? _f : 'linear';
        completeAxis[axis.id] = __assign(__assign({ offset: 0, height: 0, triggerTooltip: triggerTooltip }, continuousAxis), { data: data, scaleType: scaleType, scale: scale, tickNumber: tickNumber, colorScale: continuousAxis.colorMap && (0, colorScale_1.getSequentialColorScale)(continuousAxis.colorMap), valueFormatter: (_g = axis.valueFormatter) !== null && _g !== void 0 ? _g : (0, defaultValueFormatters_1.createScalarFormatter)(tickNumber, (0, getScale_1.getScale)(scaleType, range.map(function (v) { return scale.invert(v); }), range)) });
    });
    return {
        axis: completeAxis,
        axisIds: allAxis.map(function (_a) {
            var id = _a.id;
            return id;
        }),
    };
}
