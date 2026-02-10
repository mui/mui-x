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
exports.useScatterChartProps = void 0;
var React = require("react");
var ScatterChart_plugins_1 = require("./ScatterChart.plugins");
/**
 * A helper function that extracts ScatterChartProps from the input props
 * and returns an object with props for the children components of ScatterChart.
 *
 * @param props The input props for ScatterChart
 * @returns An object with props for the children components of ScatterChart
 */
var useScatterChartProps = function (props) {
    var _a, _b, _c, _d, _e;
    var xAxis = props.xAxis, yAxis = props.yAxis, zAxis = props.zAxis, series = props.series, axisHighlight = props.axisHighlight, voronoiMaxRadius = props.voronoiMaxRadius, disableVoronoi = props.disableVoronoi, hideLegend = props.hideLegend, width = props.width, height = props.height, margin = props.margin, colors = props.colors, sx = props.sx, grid = props.grid, onItemClick = props.onItemClick, children = props.children, slots = props.slots, slotProps = props.slotProps, loading = props.loading, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, className = props.className, showToolbar = props.showToolbar, renderer = props.renderer, brushConfig = props.brushConfig, other = __rest(props, ["xAxis", "yAxis", "zAxis", "series", "axisHighlight", "voronoiMaxRadius", "disableVoronoi", "hideLegend", "width", "height", "margin", "colors", "sx", "grid", "onItemClick", "children", "slots", "slotProps", "loading", "highlightedItem", "onHighlightChange", "className", "showToolbar", "renderer", "brushConfig"]);
    var seriesWithDefault = React.useMemo(function () { return series.map(function (s) { return (__assign({ type: 'scatter' }, s)); }); }, [series]);
    var useVoronoiOnItemClick = disableVoronoi !== true || renderer === 'svg-batch';
    var chartContainerProps = __assign(__assign({}, other), { series: seriesWithDefault, width: width, height: height, margin: margin, colors: colors, xAxis: xAxis, yAxis: yAxis, zAxis: zAxis, highlightedItem: highlightedItem, onHighlightChange: onHighlightChange, disableVoronoi: disableVoronoi, voronoiMaxRadius: voronoiMaxRadius, onItemClick: useVoronoiOnItemClick
            ? onItemClick
            : undefined, className: className, plugins: ScatterChart_plugins_1.SCATTER_CHART_PLUGINS, slots: slots, slotProps: slotProps, brushConfig: brushConfig });
    var chartsAxisProps = {
        slots: slots,
        slotProps: slotProps,
    };
    var gridProps = {
        vertical: grid === null || grid === void 0 ? void 0 : grid.vertical,
        horizontal: grid === null || grid === void 0 ? void 0 : grid.horizontal,
    };
    var scatterPlotProps = {
        onItemClick: useVoronoiOnItemClick
            ? undefined
            : onItemClick,
        slots: slots,
        slotProps: slotProps,
        renderer: renderer,
    };
    var overlayProps = {
        loading: loading,
        slots: slots,
        slotProps: slotProps,
    };
    var legendProps = {
        slots: slots,
        slotProps: slotProps,
    };
    var axisHighlightProps = __assign({ y: 'none', x: 'none' }, axisHighlight);
    var chartsWrapperProps = {
        sx: sx,
        legendPosition: (_b = (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.legend) === null || _b === void 0 ? void 0 : _b.position,
        legendDirection: (_d = (_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.legend) === null || _d === void 0 ? void 0 : _d.direction,
        hideLegend: (_e = props.hideLegend) !== null && _e !== void 0 ? _e : false,
    };
    return {
        chartsWrapperProps: chartsWrapperProps,
        chartContainerProps: chartContainerProps,
        chartsAxisProps: chartsAxisProps,
        gridProps: gridProps,
        scatterPlotProps: scatterPlotProps,
        overlayProps: overlayProps,
        legendProps: legendProps,
        axisHighlightProps: axisHighlightProps,
        children: children,
    };
};
exports.useScatterChartProps = useScatterChartProps;
