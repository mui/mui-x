"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchScatter = BatchScatter;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var scatterClasses_1 = require("./scatterClasses");
var ChartProvider_1 = require("../context/ChartProvider");
var useScale_1 = require("../hooks/useScale");
var useSelector_1 = require("../internals/store/useSelector");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
var MAX_POINTS_PER_PATH = 1000;
/* In an SVG arc, if the arc starts and ends at the same point, it is not rendered, so we add a tiny
 * value to one of the coordinates to ensure that the arc is rendered. */
var ALMOST_ZERO = 0.01;
function appendAtKey(map, key, value) {
    var bucket = map.get(key);
    if (!bucket) {
        bucket = [value];
        map.set(key, bucket);
    }
    else {
        bucket.push(value);
    }
    return bucket;
}
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
        var tempPath = appendAtKey(temporaryPaths, fill, path);
        if (tempPath.length >= MAX_POINTS_PER_PATH) {
            appendAtKey(paths, fill, tempPath.join(''));
            temporaryPaths.delete(fill);
        }
    }
    for (var _i = 0, _a = temporaryPaths.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], fill = _b[0], tempPath = _b[1];
        if (tempPath.length > 0) {
            appendAtKey(paths, fill, tempPath.join(''));
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
            children.push(<path key={i} fill={fill} d={d}/>);
            i += 1;
        }
    }
    return <React.Fragment>{children}</React.Fragment>;
}
var MemoBatchScatterPaths = React.memo(BatchScatterPaths);
var Group = (0, styles_1.styled)('g')({
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
    var isSeriesHighlighted = (0, useSelector_1.useSelector)(store, useChartHighlight_1.selectorChartIsSeriesHighlighted, [series.id]);
    var isSeriesFaded = (0, useSelector_1.useSelector)(store, useChartHighlight_1.selectorChartIsSeriesFaded, [series.id]);
    var seriesHighlightedItem = (0, useSelector_1.useSelector)(store, useChartHighlight_1.selectorChartSeriesHighlightedItem, [series.id]);
    var seriesUnfadedItem = (0, useSelector_1.useSelector)(store, useChartHighlight_1.selectorChartSeriesUnfadedItem, [series.id]);
    var highlightedModifier = 1.2;
    var markerSize = series.markerSize * (isSeriesHighlighted ? highlightedModifier : 1);
    var classes = (0, scatterClasses_1.useUtilityClasses)(inClasses);
    var siblings = [];
    if (seriesHighlightedItem != null) {
        var datum = series.data[seriesHighlightedItem];
        var getXPosition = (0, useScale_1.getValueToPositionMapper)(xScale);
        var getYPosition = (0, useScale_1.getValueToPositionMapper)(yScale);
        siblings.push(<path key={"highlighted-".concat(series.id)} fill={colorGetter ? colorGetter(seriesHighlightedItem) : color} data-highlighted d={createPath(getXPosition(datum.x), getYPosition(datum.y), markerSize * highlightedModifier)}/>);
    }
    if (seriesUnfadedItem != null) {
        var datum = series.data[seriesUnfadedItem];
        var getXPosition = (0, useScale_1.getValueToPositionMapper)(xScale);
        var getYPosition = (0, useScale_1.getValueToPositionMapper)(yScale);
        siblings.push(<path key={"unfaded-".concat(series.id)} fill={colorGetter ? colorGetter(seriesUnfadedItem) : color} d={createPath(getXPosition(datum.x), getYPosition(datum.y), markerSize)}/>);
    }
    return (<React.Fragment>
      <Group className={classes.root} data-series={series.id} data-faded={isSeriesFaded || undefined} data-highlighted={isSeriesHighlighted || undefined}>
        <MemoBatchScatterPaths series={series} xScale={xScale} yScale={yScale} color={color} colorGetter={colorGetter} markerSize={markerSize}/>
      </Group>
      {siblings}
    </React.Fragment>);
}
