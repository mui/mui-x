"use strict";
'use client';
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.useFunnelChartProps = void 0;
var constants_1 = require("@mui/x-charts/constants");
var internals_1 = require("@mui/x-charts/internals");
var warning_1 = require("@mui/x-internals/warning");
var colorPalettes_1 = require("@mui/x-charts/colorPalettes");
var FunnelChart_plugins_1 = require("./FunnelChart.plugins");
function getCategoryAxisConfig(categoryAxis, series, isHorizontal, direction) {
    var _a;
    var _b;
    var maxSeriesLength = Math.max.apply(Math, __spreadArray(__spreadArray([], series.map(function (s) { var _a; return ((_a = s.data) !== null && _a !== void 0 ? _a : []).length; }), false), [0], false));
    var maxSeriesValue = Array.from({ length: maxSeriesLength }, function (_, index) {
        return series.reduce(function (a, s) { var _a, _b, _c; return a + ((_c = (_b = (_a = s.data) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 0); }, 0);
    });
    if (process.env.NODE_ENV !== 'production') {
        if ((((categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.position) === 'left' || (categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.position) === 'right') && isHorizontal) ||
            (((categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.position) === 'top' || (categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.position) === 'bottom') && !isHorizontal)) {
            (0, warning_1.warnOnce)([
                "MUI X Charts: the categoryAxis position is set to '".concat(categoryAxis.position, "' but the series layout is ").concat(isHorizontal ? 'horizontal' : 'vertical', "."),
                "Ensure that the categoryAxis position is set to '".concat(isHorizontal ? 'top' : 'left', "' or '").concat(isHorizontal ? 'bottom' : 'right', "' for ").concat(isHorizontal ? 'horizontal' : 'vertical', " layout.\n"),
            ], 'warning');
        }
    }
    var side = isHorizontal ? 'bottom' : 'left';
    var categoryValues = __assign(__assign(__assign({ id: direction === 'x' ? constants_1.DEFAULT_X_AXIS_KEY : constants_1.DEFAULT_Y_AXIS_KEY }, categoryAxis), ((categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.size) ? (_a = {}, _a[isHorizontal ? 'height' : 'width'] = categoryAxis.size, _a) : {})), { position: ((_b = categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.position) !== null && _b !== void 0 ? _b : ((categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.categories) ? side : 'none')) });
    // If the scaleType is not defined or is 'band', our job is simple.
    if (!(categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.scaleType) || categoryAxis.scaleType === 'band') {
        return __assign(__assign({ categoryGapRatio: 0, 
            // Use the categories as the domain if they are defined.
            data: (categoryAxis === null || categoryAxis === void 0 ? void 0 : categoryAxis.categories)
                ? categoryAxis.categories
                : // Otherwise we just need random data to create the band scale.
                    Array.from({ length: maxSeriesLength }, function (_, index) { return index; }), tickLabelPlacement: 'middle' }, categoryValues), { scaleType: 'band' });
    }
    // If the scaleType is other than 'band', we have to do some magic.
    // First we need to calculate the tick values additively and in reverse order.
    var tickValues = __spreadArray(__spreadArray([], maxSeriesValue
        .toReversed()
        .map(function (_, i, arr) { return arr.slice(0, i).reduce(function (a, value) { return a + value; }, 0); }), true), [
        // We add the total value of the series as the last tick value
        maxSeriesValue.reduce(function (a, value) { return a + value; }, 0),
    ], false);
    return __assign({ domainLimit: 'strict', tickLabelPlacement: 'middle', tickInterval: tickValues, 
        // No need to show the first tick label
        tickLabelInterval: function (_, i) { return i !== 0; }, 
        // We trick the valueFormatter to show the category values.
        // By using the index of the tickValues array we can get the category value.
        valueFormatter: function (value) { var _a; return "".concat((_a = categoryAxis.categories) === null || _a === void 0 ? void 0 : _a.toReversed()[tickValues.findIndex(function (v) { return v === value; }) - 1]); } }, categoryValues);
}
/**
 * A helper function that extracts FunnelChartProps from the input props
 * and returns an object with props for the children components of FunnelChart.
 *
 * @param props The input props for FunnelChart
 * @returns An object with props for the children components of FunnelChart
 */
var useFunnelChartProps = function (props) {
    var _a, _b, _c, _d;
    var categoryAxis = props.categoryAxis, series = props.series, width = props.width, height = props.height, marginProps = props.margin, colors = props.colors, sx = props.sx, children = props.children, slots = props.slots, slotProps = props.slotProps, skipAnimation = props.skipAnimation, loading = props.loading, onItemClick = props.onItemClick, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, className = props.className, hideLegend = props.hideLegend, axisHighlight = props.axisHighlight, apiRef = props.apiRef, gap = props.gap, rest = __rest(props, ["categoryAxis", "series", "width", "height", "margin", "colors", "sx", "children", "slots", "slotProps", "skipAnimation", "loading", "onItemClick", "highlightedItem", "onHighlightChange", "className", "hideLegend", "axisHighlight", "apiRef", "gap"]);
    var margin = (0, internals_1.defaultizeMargin)(marginProps, constants_1.DEFAULT_MARGINS);
    var isHorizontal = series.some(function (s) { return s.layout === 'horizontal'; });
    var valueAxisConfig = {
        id: isHorizontal ? constants_1.DEFAULT_Y_AXIS_KEY : constants_1.DEFAULT_X_AXIS_KEY,
        scaleType: 'linear',
        domainLimit: 'strict',
        position: 'none',
    };
    var xAxis = isHorizontal
        ? getCategoryAxisConfig(categoryAxis, series, isHorizontal, 'x')
        : valueAxisConfig;
    var yAxis = isHorizontal
        ? valueAxisConfig
        : getCategoryAxisConfig(categoryAxis, series, isHorizontal, 'y');
    var chartContainerProps = __assign(__assign({}, rest), { series: series.map(function (s) { return (__assign({ type: 'funnel', layout: isHorizontal ? 'horizontal' : 'vertical' }, s)); }), width: width, height: height, margin: margin, colors: colors !== null && colors !== void 0 ? colors : colorPalettes_1.strawberrySkyPalette, xAxis: [xAxis], yAxis: [yAxis], sx: sx, highlightedItem: highlightedItem, onHighlightChange: onHighlightChange, className: className, apiRef: apiRef, plugins: FunnelChart_plugins_1.FUNNEL_CHART_PLUGINS });
    var funnelPlotProps = {
        onItemClick: onItemClick,
        slots: slots,
        slotProps: slotProps,
    };
    var overlayProps = {
        slots: slots,
        slotProps: slotProps,
        loading: loading,
    };
    var chartsAxisProps = {
        slots: slots,
        slotProps: slotProps,
    };
    var legendProps = {
        slots: slots,
        slotProps: slotProps,
    };
    var chartsWrapperProps = {
        sx: sx,
        legendPosition: (_b = (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.legend) === null || _b === void 0 ? void 0 : _b.position,
        legendDirection: (_d = (_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.legend) === null || _d === void 0 ? void 0 : _d.direction,
    };
    var axisHighlightProps = __assign({}, axisHighlight);
    return {
        chartContainerProps: chartContainerProps,
        funnelPlotProps: funnelPlotProps,
        overlayProps: overlayProps,
        chartsAxisProps: chartsAxisProps,
        legendProps: legendProps,
        chartsWrapperProps: chartsWrapperProps,
        axisHighlightProps: axisHighlightProps,
        children: children,
    };
};
exports.useFunnelChartProps = useFunnelChartProps;
