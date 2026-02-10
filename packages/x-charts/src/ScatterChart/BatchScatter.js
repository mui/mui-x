"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchScatter = BatchScatter;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var scatterClasses_1 = require("./scatterClasses");
var ChartProvider_1 = require("../context/ChartProvider");
var useScale_1 = require("../hooks/useScale");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
var appendAtKey_1 = require("../internals/appendAtKey");
var MAX_POINTS_PER_PATH = 1000;
/* In an SVG arc, if the arc starts and ends at the same point, it is not rendered, so we add a tiny
 * value to one of the coordinates to ensure that the arc is rendered. */
var ALMOST_ZERO = 0.01;
function createPath(x, y, markerSize) {
    return "M".concat(x - markerSize, " ").concat(y, " a").concat(markerSize, " ").concat(markerSize, " 0 1 1 0 ").concat(ALMOST_ZERO);
}
function useCreatePaths(seriesData, markerSize, xScale, yScale, color, colorGetter) {
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var getXPosition = (0, useScale_1.getValueToPositionMapper)(xScale);
    var getYPosition = (0, useScale_1.getValueToPositionMapper)(yScale);
    var paths = new Map();
    var temporaryPaths = new Map();
    for (var i = 0; i < seriesData.length; i += 1) {
        var scatterPoint = seriesData[i];
        var x = getXPosition(scatterPoint.x);
        var y = getYPosition(scatterPoint.y);
        if (!instance.isPointInside(x, y)) {
            continue;
        }
        var path = createPath(x, y, markerSize);
        var fill = colorGetter ? colorGetter(i) : color;
        var tempPath = (0, appendAtKey_1.appendAtKey)(temporaryPaths, fill, path);
        if (tempPath.length >= MAX_POINTS_PER_PATH) {
            (0, appendAtKey_1.appendAtKey)(paths, fill, tempPath.join(''));
            temporaryPaths.delete(fill);
        }
    }
    for (var _i = 0, _a = temporaryPaths.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], fill = _b[0], tempPath = _b[1];
        if (tempPath.length > 0) {
            (0, appendAtKey_1.appendAtKey)(paths, fill, tempPath.join(''));
        }
    }
    return paths;
}
function BatchScatterPaths(props) {
    var series = props.series, xScale = props.xScale, yScale = props.yScale, color = props.color, colorGetter = props.colorGetter, markerSize = props.markerSize;
    var paths = useCreatePaths(series.data, markerSize, xScale, yScale, color, colorGetter);
    var children = [];
    var i = 0;
    for (var _i = 0, _a = paths.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], fill = _b[0], dArray = _b[1];
        for (var _c = 0, dArray_1 = dArray; _c < dArray_1.length; _c++) {
            var d = dArray_1[_c];
            children.push((0, jsx_runtime_1.jsx)("path", { fill: fill, d: d }, i));
            i += 1;
        }
    }
    return (0, jsx_runtime_1.jsx)(React.Fragment, { children: children });
}
var MemoBatchScatterPaths = React.memo(BatchScatterPaths);
var Group = (0, styles_1.styled)('g', {
    slot: 'internal',
    shouldForwardProp: undefined,
})({
    '&[data-faded="true"]': {
        opacity: 0.3,
    },
    '& path': {
        /* The browser must do hit testing to know which element a pointer is interacting with.
         * With many data points, we create many paths causing significant time to be spent in the hit test phase.
         * To fix this issue, we disable pointer events for the descendant paths.
         *
         * Ideally, users should be able to override this in case they need pointer events to be enabled,
         * but it can affect performance negatively, especially with many data points. */
        pointerEvents: 'none',
    },
});
/**
 * @internal
 * A batch version of the Scatter component that uses SVG paths to render points.
 * This component is optimized for performance and is suitable for rendering large datasets, but has limitations. Some of the limitations include:
 * - Limited CSS styling;
 * - Overriding the `marker` slot is not supported;
 * - Highlight style must not contain opacity.
 *
 * You can read about all the limitations [here](https://mui.com/x/react-charts/scatter/#performance).
 */
function BatchScatter(props) {
    var series = props.series, xScale = props.xScale, yScale = props.yScale, color = props.color, colorGetter = props.colorGetter, inClasses = props.classes;
    var store = (0, ChartProvider_1.useChartContext)().store;
    var isSeriesHighlighted = store.use(useChartHighlight_1.selectorChartIsSeriesHighlighted, series.id);
    var isSeriesFaded = store.use(useChartHighlight_1.selectorChartIsSeriesFaded, series.id);
    var seriesHighlightedItem = store.use(useChartHighlight_1.selectorChartSeriesHighlightedItem, series.id);
    var seriesUnfadedItem = store.use(useChartHighlight_1.selectorChartSeriesUnfadedItem, series.id);
    var highlightedModifier = 1.2;
    var markerSize = series.markerSize * (isSeriesHighlighted ? highlightedModifier : 1);
    var classes = (0, scatterClasses_1.useUtilityClasses)(inClasses);
    var siblings = [];
    if (seriesHighlightedItem != null) {
        var datum = series.data[seriesHighlightedItem];
        var getXPosition = (0, useScale_1.getValueToPositionMapper)(xScale);
        var getYPosition = (0, useScale_1.getValueToPositionMapper)(yScale);
        siblings.push((0, jsx_runtime_1.jsx)("path", { fill: colorGetter ? colorGetter(seriesHighlightedItem) : color, "data-highlighted": true, d: createPath(getXPosition(datum.x), getYPosition(datum.y), markerSize * highlightedModifier) }, "highlighted-".concat(series.id)));
    }
    if (seriesUnfadedItem != null) {
        var datum = series.data[seriesUnfadedItem];
        var getXPosition = (0, useScale_1.getValueToPositionMapper)(xScale);
        var getYPosition = (0, useScale_1.getValueToPositionMapper)(yScale);
        siblings.push((0, jsx_runtime_1.jsx)("path", { fill: colorGetter ? colorGetter(seriesUnfadedItem) : color, d: createPath(getXPosition(datum.x), getYPosition(datum.y), markerSize) }, "unfaded-".concat(series.id)));
    }
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(Group, { className: classes.root, "data-series": series.id, "data-faded": isSeriesFaded || undefined, "data-highlighted": isSeriesHighlighted || undefined, children: (0, jsx_runtime_1.jsx)(MemoBatchScatterPaths, { series: series, xScale: xScale, yScale: yScale, color: color, colorGetter: colorGetter, markerSize: markerSize }) }), siblings] }));
}
