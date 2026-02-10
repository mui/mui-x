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
exports.useChartsContainerProps = void 0;
var allPlugins_1 = require("../internals/plugins/allPlugins");
var useChartsContainerProps = function (props, ref) {
    var _a = props, width = _a.width, height = _a.height, margin = _a.margin, children = _a.children, series = _a.series, colors = _a.colors, dataset = _a.dataset, desc = _a.desc, onAxisClick = _a.onAxisClick, highlightedAxis = _a.highlightedAxis, onHighlightedAxisChange = _a.onHighlightedAxisChange, tooltipItem = _a.tooltipItem, onTooltipItemChange = _a.onTooltipItemChange, disableVoronoi = _a.disableVoronoi, voronoiMaxRadius = _a.voronoiMaxRadius, onItemClick = _a.onItemClick, disableAxisListener = _a.disableAxisListener, highlightedItem = _a.highlightedItem, onHighlightChange = _a.onHighlightChange, sx = _a.sx, title = _a.title, axesGap = _a.axesGap, xAxis = _a.xAxis, yAxis = _a.yAxis, zAxis = _a.zAxis, rotationAxis = _a.rotationAxis, radiusAxis = _a.radiusAxis, skipAnimation = _a.skipAnimation, seriesConfig = _a.seriesConfig, plugins = _a.plugins, localeText = _a.localeText, slots = _a.slots, slotProps = _a.slotProps, experimentalFeatures = _a.experimentalFeatures, enableKeyboardNavigation = _a.enableKeyboardNavigation, brushConfig = _a.brushConfig, onHiddenItemsChange = _a.onHiddenItemsChange, hiddenItems = _a.hiddenItems, initialHiddenItems = _a.initialHiddenItems, other = __rest(_a, ["width", "height", "margin", "children", "series", "colors", "dataset", "desc", "onAxisClick", "highlightedAxis", "onHighlightedAxisChange", "tooltipItem", "onTooltipItemChange", "disableVoronoi", "voronoiMaxRadius", "onItemClick", "disableAxisListener", "highlightedItem", "onHighlightChange", "sx", "title", "axesGap", "xAxis", "yAxis", "zAxis", "rotationAxis", "radiusAxis", "skipAnimation", "seriesConfig", "plugins", "localeText", "slots", "slotProps", "experimentalFeatures", "enableKeyboardNavigation", "brushConfig", "onHiddenItemsChange", "hiddenItems", "initialHiddenItems"]);
    var chartsSurfaceProps = __assign({ title: title, desc: desc, sx: sx, ref: ref }, other);
    var chartDataProviderProps = {
        margin: margin,
        series: series,
        colors: colors,
        dataset: dataset,
        disableAxisListener: disableAxisListener,
        highlightedItem: highlightedItem,
        onHighlightChange: onHighlightChange,
        onAxisClick: onAxisClick,
        highlightedAxis: highlightedAxis,
        onHighlightedAxisChange: onHighlightedAxisChange,
        tooltipItem: tooltipItem,
        onTooltipItemChange: onTooltipItemChange,
        disableVoronoi: disableVoronoi,
        voronoiMaxRadius: voronoiMaxRadius,
        onItemClick: onItemClick,
        axesGap: axesGap,
        xAxis: xAxis,
        yAxis: yAxis,
        zAxis: zAxis,
        rotationAxis: rotationAxis,
        radiusAxis: radiusAxis,
        skipAnimation: skipAnimation,
        width: width,
        height: height,
        localeText: localeText,
        seriesConfig: seriesConfig,
        experimentalFeatures: experimentalFeatures,
        enableKeyboardNavigation: enableKeyboardNavigation,
        brushConfig: brushConfig,
        onHiddenItemsChange: onHiddenItemsChange,
        hiddenItems: hiddenItems,
        initialHiddenItems: initialHiddenItems,
        plugins: plugins !== null && plugins !== void 0 ? plugins : allPlugins_1.DEFAULT_PLUGINS,
        slots: slots,
        slotProps: slotProps,
    };
    return {
        chartDataProviderProps: chartDataProviderProps,
        chartsSurfaceProps: chartsSurfaceProps,
        children: children,
    };
};
exports.useChartsContainerProps = useChartsContainerProps;
