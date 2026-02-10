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
exports.useLineChartProps = void 0;
var React = require("react");
var useId_1 = require("@mui/utils/useId");
var constants_1 = require("../constants");
var LineChart_plugins_1 = require("./LineChart.plugins");
/**
 * A helper function that extracts LineChartProps from the input props
 * and returns an object with props for the children components of LineChart.
 *
 * @param props The input props for LineChart
 * @returns An object with props for the children components of LineChart
 */
var useLineChartProps = function (props) {
    var _a, _b, _c, _d, _e, _f;
    var xAxis = props.xAxis, yAxis = props.yAxis, series = props.series, width = props.width, height = props.height, margin = props.margin, colors = props.colors, dataset = props.dataset, sx = props.sx, onAreaClick = props.onAreaClick, onLineClick = props.onLineClick, onMarkClick = props.onMarkClick, axisHighlight = props.axisHighlight, disableLineItemHighlight = props.disableLineItemHighlight, hideLegend = props.hideLegend, grid = props.grid, children = props.children, slots = props.slots, slotProps = props.slotProps, skipAnimation = props.skipAnimation, loading = props.loading, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, className = props.className, showToolbar = props.showToolbar, brushConfig = props.brushConfig, other = __rest(props, ["xAxis", "yAxis", "series", "width", "height", "margin", "colors", "dataset", "sx", "onAreaClick", "onLineClick", "onMarkClick", "axisHighlight", "disableLineItemHighlight", "hideLegend", "grid", "children", "slots", "slotProps", "skipAnimation", "loading", "highlightedItem", "onHighlightChange", "className", "showToolbar", "brushConfig"]);
    var id = (0, useId_1.default)();
    var clipPathId = "".concat(id, "-clip-path");
    var seriesWithDefault = React.useMemo(function () {
        return series.map(function (s) { return (__assign({ disableHighlight: !!disableLineItemHighlight, type: 'line' }, s)); });
    }, [disableLineItemHighlight, series]);
    var chartContainerProps = __assign(__assign({}, other), { series: seriesWithDefault, width: width, height: height, margin: margin, colors: colors, dataset: dataset, xAxis: xAxis !== null && xAxis !== void 0 ? xAxis : [
            {
                id: constants_1.DEFAULT_X_AXIS_KEY,
                scaleType: 'point',
                data: Array.from({ length: Math.max.apply(Math, series.map(function (s) { var _a, _b; return ((_b = (_a = s.data) !== null && _a !== void 0 ? _a : dataset) !== null && _b !== void 0 ? _b : []).length; })) }, function (_, index) { return index; }),
            },
        ], yAxis: yAxis, highlightedItem: highlightedItem, onHighlightChange: onHighlightChange, disableAxisListener: ((_a = slotProps === null || slotProps === void 0 ? void 0 : slotProps.tooltip) === null || _a === void 0 ? void 0 : _a.trigger) !== 'axis' &&
            (axisHighlight === null || axisHighlight === void 0 ? void 0 : axisHighlight.x) === 'none' &&
            (axisHighlight === null || axisHighlight === void 0 ? void 0 : axisHighlight.y) === 'none', className: className, skipAnimation: skipAnimation, brushConfig: brushConfig, plugins: LineChart_plugins_1.LINE_CHART_PLUGINS });
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
    var areaPlotProps = {
        slots: slots,
        slotProps: slotProps,
        onItemClick: onAreaClick,
    };
    var linePlotProps = {
        slots: slots,
        slotProps: slotProps,
        onItemClick: onLineClick,
    };
    var markPlotProps = {
        slots: slots,
        slotProps: slotProps,
        onItemClick: onMarkClick,
        skipAnimation: skipAnimation,
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
    var axisHighlightProps = __assign({ x: 'line' }, axisHighlight);
    var lineHighlightPlotProps = {
        slots: slots,
        slotProps: slotProps,
    };
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
        gridProps: gridProps,
        clipPathProps: clipPathProps,
        clipPathGroupProps: clipPathGroupProps,
        areaPlotProps: areaPlotProps,
        linePlotProps: linePlotProps,
        markPlotProps: markPlotProps,
        overlayProps: overlayProps,
        chartsAxisProps: chartsAxisProps,
        axisHighlightProps: axisHighlightProps,
        lineHighlightPlotProps: lineHighlightPlotProps,
        legendProps: legendProps,
        children: children,
    };
};
exports.useLineChartProps = useLineChartProps;
