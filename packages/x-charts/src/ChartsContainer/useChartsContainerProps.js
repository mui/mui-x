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
var useChartsContainerProps = function (props) {
    var _a = props, width = _a.width, height = _a.height, margin = _a.margin, children = _a.children, series = _a.series, colors = _a.colors, dataset = _a.dataset, desc = _a.desc, onAxisClick = _a.onAxisClick, highlightedAxis = _a.highlightedAxis, onHighlightedAxisChange = _a.onHighlightedAxisChange, tooltipAxis = _a.tooltipAxis, onTooltipAxisChange = _a.onTooltipAxisChange, tooltipItem = _a.tooltipItem, onTooltipItemChange = _a.onTooltipItemChange, disableHitArea = _a.disableHitArea, hitAreaRadius = _a.hitAreaRadius, onItemClick = _a.onItemClick, disableAxisListener = _a.disableAxisListener, highlightedItem = _a.highlightedItem, onHighlightChange = _a.onHighlightChange, sx = _a.sx, title = _a.title, axesGap = _a.axesGap, xAxis = _a.xAxis, yAxis = _a.yAxis, zAxis = _a.zAxis, rotationAxis = _a.rotationAxis, radiusAxis = _a.radiusAxis, skipAnimation = _a.skipAnimation, seriesConfig = _a.seriesConfig, experimentalFeatures = _a.experimentalFeatures, plugins = _a.plugins, localeText = _a.localeText, slots = _a.slots, slotProps = _a.slotProps, disableKeyboardNavigation = _a.disableKeyboardNavigation, brushConfig = _a.brushConfig, onHiddenItemsChange = _a.onHiddenItemsChange, hiddenItems = _a.hiddenItems, initialHiddenItems = _a.initialHiddenItems, other = __rest(_a, ["width", "height", "margin", "children", "series", "colors", "dataset", "desc", "onAxisClick", "highlightedAxis", "onHighlightedAxisChange", "tooltipAxis", "onTooltipAxisChange", "tooltipItem", "onTooltipItemChange", "disableHitArea", "hitAreaRadius", "onItemClick", "disableAxisListener", "highlightedItem", "onHighlightChange", "sx", "title", "axesGap", "xAxis", "yAxis", "zAxis", "rotationAxis", "radiusAxis", "skipAnimation", "seriesConfig", "experimentalFeatures", "plugins", "localeText", "slots", "slotProps", "disableKeyboardNavigation", "brushConfig", "onHiddenItemsChange", "hiddenItems", "initialHiddenItems"]);
    var chartsSurfaceProps = __assign({ title: title, desc: desc, sx: sx }, other);
    var chartsDataProviderProps = {
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
        tooltipAxis: tooltipAxis,
        onTooltipAxisChange: onTooltipAxisChange,
        tooltipItem: tooltipItem,
        onTooltipItemChange: onTooltipItemChange,
        disableHitArea: disableHitArea,
        hitAreaRadius: hitAreaRadius,
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
        disableKeyboardNavigation: disableKeyboardNavigation,
        brushConfig: brushConfig,
        onHiddenItemsChange: onHiddenItemsChange,
        hiddenItems: hiddenItems,
        initialHiddenItems: initialHiddenItems,
        plugins: plugins !== null && plugins !== void 0 ? plugins : allPlugins_1.DEFAULT_PLUGINS,
        slots: slots,
        slotProps: slotProps,
    };
    return {
        chartsDataProviderProps: chartsDataProviderProps,
        chartsSurfaceProps: chartsSurfaceProps,
        children: children,
    };
};
exports.useChartsContainerProps = useChartsContainerProps;
