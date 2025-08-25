"use strict";
'use client';
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
exports.useRadarChartProps = void 0;
/**
 * A helper function that extracts RadarChartProps from the input props
 * and returns an object with props for the children components of RadarChart.
 *
 * @param props The input props for RadarChart
 * @returns An object with props for the children components of RadarChart
 */
var useRadarChartProps = function (props) {
    var apiRef = props.apiRef, series = props.series, radar = props.radar, width = props.width, height = props.height, margin = props.margin, colors = props.colors, sx = props.sx, children = props.children, slots = props.slots, slotProps = props.slotProps, skipAnimation = props.skipAnimation, loading = props.loading, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, hideLegend = props.hideLegend, divisions = props.divisions, shape = props.shape, stripeColor = props.stripeColor, _a = props.highlight, highlight = _a === void 0 ? 'axis' : _a, showToolbar = props.showToolbar, onAxisClick = props.onAxisClick, onAreaClick = props.onAreaClick, onMarkClick = props.onMarkClick, other = __rest(props, ["apiRef", "series", "radar", "width", "height", "margin", "colors", "sx", "children", "slots", "slotProps", "skipAnimation", "loading", "highlightedItem", "onHighlightChange", "hideLegend", "divisions", "shape", "stripeColor", "highlight", "showToolbar", "onAxisClick", "onAreaClick", "onMarkClick"]);
    var radarDataProviderProps = {
        apiRef: apiRef,
        series: series,
        radar: radar,
        highlight: highlight,
        width: width,
        height: height,
        margin: margin,
        colors: colors,
        highlightedItem: highlightedItem,
        onHighlightChange: onHighlightChange,
        skipAnimation: skipAnimation,
        onAxisClick: onAxisClick,
    };
    var overlayProps = {
        slots: slots,
        slotProps: slotProps,
        loading: loading,
    };
    var legendProps = {
        slots: slots,
        slotProps: slotProps,
    };
    var chartsWrapperProps = {
        sx: sx,
    };
    var radarGrid = { divisions: divisions, shape: shape, stripeColor: stripeColor };
    var radarSeriesAreaProps = { onItemClick: onAreaClick };
    var radarSeriesMarksProps = { onItemClick: onMarkClick };
    var chartsSurfaceProps = other;
    return {
        highlight: highlight,
        chartsWrapperProps: chartsWrapperProps,
        chartsSurfaceProps: chartsSurfaceProps,
        radarDataProviderProps: radarDataProviderProps,
        radarGrid: radarGrid,
        radarSeriesAreaProps: radarSeriesAreaProps,
        radarSeriesMarksProps: radarSeriesMarksProps,
        overlayProps: overlayProps,
        legendProps: legendProps,
        children: children,
    };
};
exports.useRadarChartProps = useRadarChartProps;
