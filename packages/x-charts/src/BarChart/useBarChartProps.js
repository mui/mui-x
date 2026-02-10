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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBarChartProps = void 0;
var React = require("react");
var useId_1 = require("@mui/utils/useId");
var constants_1 = require("../constants");
var BarChart_plugins_1 = require("./BarChart.plugins");
/**
 * A helper function that extracts BarChartProps from the input props
 * and returns an object with props for the children components of BarChart.
 *
 * @param props The input props for BarChart
 * @returns An object with props for the children components of BarChart
 */
var useBarChartProps = function (props) {
    var _a, _b, _c, _d, _e, _f;
    var xAxis = props.xAxis, yAxis = props.yAxis, series = props.series, width = props.width, height = props.height, margin = props.margin, colors = props.colors, dataset = props.dataset, sx = props.sx, axisHighlight = props.axisHighlight, grid = props.grid, children = props.children, slots = props.slots, slotProps = props.slotProps, skipAnimation = props.skipAnimation, loading = props.loading, layout = props.layout, onItemClick = props.onItemClick, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, borderRadius = props.borderRadius, barLabel = props.barLabel, className = props.className, hideLegend = props.hideLegend, showToolbar = props.showToolbar, brushConfig = props.brushConfig, renderer = props.renderer, other = __rest(props, ["xAxis", "yAxis", "series", "width", "height", "margin", "colors", "dataset", "sx", "axisHighlight", "grid", "children", "slots", "slotProps", "skipAnimation", "loading", "layout", "onItemClick", "highlightedItem", "onHighlightChange", "borderRadius", "barLabel", "className", "hideLegend", "showToolbar", "brushConfig", "renderer"]);
    var id = (0, useId_1.default)();
    var clipPathId = "".concat(id, "-clip-path");
    var hasHorizontalSeries = layout === 'horizontal' ||
        (layout === undefined && series.some(function (item) { return item.layout === 'horizontal'; }));
    var defaultBandXAxis = React.useMemo(function () { return [
        {
            id: constants_1.DEFAULT_X_AXIS_KEY,
            scaleType: 'band',
            data: Array.from({ length: Math.max.apply(Math, series.map(function (s) { var _a, _b; return ((_b = (_a = s.data) !== null && _a !== void 0 ? _a : dataset) !== null && _b !== void 0 ? _b : []).length; })) }, function (_, index) { return index; }),
        },
    ]; }, [dataset, series]);
    var defaultBandYAxis = React.useMemo(function () { return [
        {
            id: constants_1.DEFAULT_Y_AXIS_KEY,
            scaleType: 'band',
            data: Array.from({ length: Math.max.apply(Math, series.map(function (s) { var _a, _b; return ((_b = (_a = s.data) !== null && _a !== void 0 ? _a : dataset) !== null && _b !== void 0 ? _b : []).length; })) }, function (_, index) { return index; }),
        },
    ]; }, [dataset, series]);
    var seriesWithDefault = React.useMemo(function () {
        return series.map(function (s) { return (__assign(__assign({ type: 'bar' }, s), { layout: hasHorizontalSeries ? 'horizontal' : 'vertical' })); });
    }, [hasHorizontalSeries, series]);
    var defaultXAxis = hasHorizontalSeries ? undefined : defaultBandXAxis;
    var processedXAxis = React.useMemo(function () {
        if (!xAxis) {
            return defaultXAxis;
        }
        return hasHorizontalSeries
            ? xAxis
            : xAxis.map(function (axis) { return (__assign({ scaleType: 'band' }, axis)); });
    }, [defaultXAxis, hasHorizontalSeries, xAxis]);
    var defaultYAxis = hasHorizontalSeries ? defaultBandYAxis : undefined;
    var processedYAxis = React.useMemo(function () {
        if (!yAxis) {
            return defaultYAxis;
        }
        return hasHorizontalSeries
            ? yAxis.map(function (axis) { return (__assign({ scaleType: 'band' }, axis)); })
            : yAxis;
    }, [defaultYAxis, hasHorizontalSeries, yAxis]);
    var chartContainerProps = __assign(__assign({}, other), { series: seriesWithDefault, width: width, height: height, margin: margin, colors: colors, dataset: dataset, xAxis: processedXAxis, yAxis: processedYAxis, highlightedItem: highlightedItem, onHighlightChange: onHighlightChange, disableAxisListener: ((_a = slotProps === null || slotProps === void 0 ? void 0 : slotProps.tooltip) === null || _a === void 0 ? void 0 : _a.trigger) !== 'axis' &&
            (axisHighlight === null || axisHighlight === void 0 ? void 0 : axisHighlight.x) === 'none' &&
            (axisHighlight === null || axisHighlight === void 0 ? void 0 : axisHighlight.y) === 'none', className: className, skipAnimation: skipAnimation, brushConfig: brushConfig, plugins: BarChart_plugins_1.BAR_CHART_PLUGINS });
    var barPlotProps = {
        onItemClick: onItemClick,
        slots: slots,
        slotProps: slotProps,
        borderRadius: borderRadius,
        renderer: renderer,
        barLabel: barLabel,
    };
    var gridProps = {
        vertical: grid === null || grid === void 0 ? void 0 : grid.vertical,
        horizontal: grid === null || grid === void 0 ? void 0 : grid.horizontal,
    };
    var clipPathGroupProps = {
        clipPath: "url(#".concat(clipPathId, ")"),
    };
    var clipPathProps = {
        id: clipPathId,
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
    var axisHighlightProps = __assign(__assign({}, (hasHorizontalSeries ? { y: 'band' } : { x: 'band' })), axisHighlight);
    var legendProps = {
        slots: slots,
        slotProps: slotProps,
    };
    var chartsWrapperProps = {
        sx: sx,
        legendPosition: (_c = (_b = props.slotProps) === null || _b === void 0 ? void 0 : _b.legend) === null || _c === void 0 ? void 0 : _c.position,
        legendDirection: (_e = (_d = props.slotProps) === null || _d === void 0 ? void 0 : _d.legend) === null || _e === void 0 ? void 0 : _e.direction,
        hideLegend: (_f = props.hideLegend) !== null && _f !== void 0 ? _f : false,
    };
    return {
        chartsWrapperProps: chartsWrapperProps,
        chartContainerProps: chartContainerProps,
        barPlotProps: barPlotProps,
        gridProps: gridProps,
        clipPathProps: clipPathProps,
        clipPathGroupProps: clipPathGroupProps,
        overlayProps: overlayProps,
        chartsAxisProps: chartsAxisProps,
        axisHighlightProps: axisHighlightProps,
        legendProps: legendProps,
        children: children,
    };
};
exports.useBarChartProps = useBarChartProps;
