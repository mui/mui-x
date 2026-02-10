"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchBarPlot = BatchBarPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var hooks_1 = require("../../hooks");
var barClasses_1 = require("../barClasses");
var useChartContext_1 = require("../../context/ChartProvider/useChartContext");
var useChartHighlight_1 = require("../../internals/plugins/featurePlugins/useChartHighlight");
var useRegisterItemClickHandlers_1 = require("../useRegisterItemClickHandlers");
var useCreateBarPaths_1 = require("./useCreateBarPaths");
var BarGroup_1 = require("./BarGroup");
var useRegisterPointerInteractions_1 = require("../../internals/plugins/featurePlugins/shared/useRegisterPointerInteractions");
var useChartCartesianAxisPosition_selectors_1 = require("../../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisPosition.selectors");
function BatchBarPlot(_a) {
    var completedData = _a.completedData, _b = _a.borderRadius, borderRadius = _b === void 0 ? 0 : _b, onItemClick = _a.onItemClick, _c = _a.skipAnimation, skipAnimation = _c === void 0 ? false : _c;
    var prevCursorRef = React.useRef(null);
    var svgRef = (0, hooks_1.useSvgRef)();
    var onItemEnter = onItemClick
        ? function () {
            var svg = svgRef.current;
            if (!svg) {
                return;
            }
            if (prevCursorRef.current == null) {
                prevCursorRef.current = svg.style.cursor;
                // eslint-disable-next-line react-compiler/react-compiler
                svg.style.cursor = 'pointer';
            }
        }
        : undefined;
    var onItemLeave = onItemClick
        ? function () {
            var svg = svgRef.current;
            if (!svg) {
                return;
            }
            if (prevCursorRef.current != null) {
                svg.style.cursor = prevCursorRef.current;
                prevCursorRef.current = null;
            }
        }
        : undefined;
    (0, useRegisterPointerInteractions_1.useRegisterPointerInteractions)(useChartCartesianAxisPosition_selectors_1.selectorBarItemAtPosition, onItemEnter, onItemLeave);
    (0, useRegisterItemClickHandlers_1.useRegisterItemClickHandlers)(onItemClick);
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: completedData.map(function (series) { return ((0, jsx_runtime_1.jsx)(SeriesBatchPlot, { series: series, borderRadius: borderRadius, skipAnimation: skipAnimation }, series.seriesId)); }) }));
}
var MemoFadedHighlightedBars = React.memo(FadedHighlightedBars);
function SeriesBatchPlot(_a) {
    var series = _a.series, borderRadius = _a.borderRadius, skipAnimation = _a.skipAnimation;
    var classes = (0, barClasses_1.useUtilityClasses)();
    var store = (0, useChartContext_1.useChartContext)().store;
    var isSeriesHighlighted = store.use(useChartHighlight_1.selectorChartIsSeriesHighlighted, series.seriesId);
    var isSeriesFaded = store.use(useChartHighlight_1.selectorChartIsSeriesFaded, series.seriesId);
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(BarGroup_1.BarGroup, { className: classes.series, "data-series": series.seriesId, layout: series.layout, xOrigin: series.xOrigin, yOrigin: series.yOrigin, skipAnimation: skipAnimation, "data-faded": isSeriesFaded || undefined, "data-highlighted": isSeriesHighlighted || undefined, children: (0, jsx_runtime_1.jsx)(BatchBarSeriesPlot, { processedSeries: series, borderRadius: borderRadius }) }), (0, jsx_runtime_1.jsx)(MemoFadedHighlightedBars, { processedSeries: series, borderRadius: borderRadius })] }));
}
function BatchBarSeriesPlot(_a) {
    var processedSeries = _a.processedSeries, borderRadius = _a.borderRadius;
    var paths = (0, useCreateBarPaths_1.useCreateBarPaths)(processedSeries, borderRadius);
    var children = [];
    var i = 0;
    for (var _i = 0, _b = paths.entries(); _i < _b.length; _i++) {
        var _c = _b[_i], fill = _c[0], dArray = _c[1];
        for (var _d = 0, dArray_1 = dArray; _d < dArray_1.length; _d++) {
            var d = dArray_1[_d];
            children.push((0, jsx_runtime_1.jsx)("path", { fill: fill, d: d }, i));
            i += 1;
        }
    }
    return (0, jsx_runtime_1.jsx)(React.Fragment, { children: children });
}
function FadedHighlightedBars(_a) {
    var processedSeries = _a.processedSeries, borderRadius = _a.borderRadius;
    var store = (0, useChartContext_1.useChartContext)().store;
    var seriesHighlightedDataIndex = store.use(useChartHighlight_1.selectorChartSeriesHighlightedItem, processedSeries.seriesId);
    var seriesUnfadedDataIndex = store.use(useChartHighlight_1.selectorChartSeriesUnfadedItem, processedSeries.seriesId);
    var seriesHighlightedItem = seriesHighlightedDataIndex != null
        ? processedSeries.data.find(function (v) { return v.dataIndex === seriesHighlightedDataIndex; }) || null
        : null;
    var seriesUnfadedItem = seriesUnfadedDataIndex != null
        ? processedSeries.data.find(function (v) { return v.dataIndex === seriesUnfadedDataIndex; }) || null
        : null;
    var siblings = [];
    if (seriesHighlightedItem != null) {
        siblings.push((0, jsx_runtime_1.jsx)("path", { fill: seriesHighlightedItem.color, filter: "brightness(120%)", "data-highlighted": true, d: (0, useCreateBarPaths_1.createPath)(seriesHighlightedItem, borderRadius) }, "highlighted-".concat(processedSeries.seriesId)));
    }
    if (seriesUnfadedItem != null) {
        siblings.push((0, jsx_runtime_1.jsx)("path", { fill: seriesUnfadedItem.color, d: (0, useCreateBarPaths_1.createPath)(seriesUnfadedItem, borderRadius) }, "unfaded-".concat(seriesUnfadedItem.seriesId)));
    }
    return (0, jsx_runtime_1.jsx)(React.Fragment, { children: siblings });
}
