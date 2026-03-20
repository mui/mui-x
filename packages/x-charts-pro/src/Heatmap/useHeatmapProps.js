"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHeatmapProps = useHeatmapProps;
var useId_1 = require("@mui/utils/useId");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var React = require("react");
var constants_1 = require("@mui/x-charts/constants");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var Heatmap_plugins_1 = require("./Heatmap.plugins");
var seriesConfig_1 = require("./seriesConfig");
var seriesConfig = { heatmap: seriesConfig_1.heatmapSeriesConfig };
// The GnBu: https://github.com/d3/d3-scale-chromatic/blob/main/src/sequential-multi/GnBu.js
var defaultColorMap = (0, d3_interpolate_1.interpolateRgbBasis)([
    '#f7fcf0',
    '#e0f3db',
    '#ccebc5',
    '#a8ddb5',
    '#7bccc4',
    '#4eb3d3',
    '#2b8cbe',
    '#0868ac',
    '#084081',
]);
function getDefaultDataForAxis(series, dimension) {
    var _a;
    if (((_a = series === null || series === void 0 ? void 0 : series[0]) === null || _a === void 0 ? void 0 : _a.data) === undefined || series[0].data.length === 0) {
        return [];
    }
    return Array.from({ length: Math.max.apply(Math, series[0].data.map(function (dataPoint) { return dataPoint[dimension]; })) + 1 }, function (_, index) { return index; });
}
var getDefaultDataForXAxis = function (series) { return getDefaultDataForAxis(series, 0); };
var getDefaultDataForYAxis = function (series) { return getDefaultDataForAxis(series, 1); };
function useHeatmapProps(props) {
    var _a, _b, _c, _d, _e, _f;
    var apiRef = props.apiRef, xAxis = props.xAxis, yAxis = props.yAxis, zAxis = props.zAxis, series = props.series, width = props.width, height = props.height, margin = props.margin, colors = props.colors, dataset = props.dataset, sx = props.sx, onItemClick = props.onItemClick, children = props.children, slots = props.slots, slotProps = props.slotProps, loading = props.loading, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, disableKeyboardNavigation = props.disableKeyboardNavigation, borderRadius = props.borderRadius, hideLegend = props.hideLegend;
    var id = (0, useId_1.default)();
    var clipPathId = "".concat(id, "-clip-path");
    var xAxisWithDefault = React.useMemo(function () {
        return (xAxis && xAxis.length > 0 ? xAxis : [{ id: constants_1.DEFAULT_X_AXIS_KEY }]).map(function (axis) {
            var _a;
            return (__assign(__assign({ scaleType: 'band', categoryGapRatio: 0 }, axis), { data: (_a = axis.data) !== null && _a !== void 0 ? _a : getDefaultDataForXAxis(series) }));
        });
    }, [series, xAxis]);
    var yAxisWithDefault = React.useMemo(function () {
        return (yAxis && yAxis.length > 0 ? yAxis : [{ id: constants_1.DEFAULT_Y_AXIS_KEY }]).map(function (axis) {
            var _a;
            return (__assign(__assign({ scaleType: 'band', categoryGapRatio: 0 }, axis), { data: (_a = axis.data) !== null && _a !== void 0 ? _a : getDefaultDataForYAxis(series) }));
        });
    }, [series, yAxis]);
    var zAxisWithDefault = React.useMemo(function () {
        return zAxis !== null && zAxis !== void 0 ? zAxis : [
            {
                colorMap: {
                    type: 'continuous',
                    min: 0,
                    max: 100,
                    color: defaultColorMap,
                },
            },
        ];
    }, [zAxis]);
    var seriesWithDefault = series.map(function (s) { return (__assign({ type: 'heatmap' }, s)); });
    var chartsWrapperProps = {
        sx: sx,
        legendPosition: (_b = (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.legend) === null || _b === void 0 ? void 0 : _b.position,
        legendDirection: (_d = (_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.legend) === null || _d === void 0 ? void 0 : _d.direction,
        hideLegend: hideLegend,
    };
    var chartsDataProviderProProps = {
        apiRef: apiRef,
        seriesConfig: seriesConfig,
        series: seriesWithDefault,
        width: width,
        height: height,
        margin: margin,
        xAxis: xAxisWithDefault,
        yAxis: yAxisWithDefault,
        zAxis: zAxisWithDefault,
        colors: colors,
        dataset: dataset,
        disableAxisListener: true,
        highlightedItem: highlightedItem,
        onHighlightChange: onHighlightChange,
        disableKeyboardNavigation: disableKeyboardNavigation,
        onItemClick: onItemClick,
        plugins: Heatmap_plugins_1.HEATMAP_PLUGINS,
    };
    var heatmapPlotProps = {
        borderRadius: borderRadius,
        slots: slots,
        slotProps: slotProps,
    };
    var overlayProps = {
        slots: slots,
        slotProps: slotProps,
        loading: loading,
    };
    var clipPathGroupProps = {
        clipPath: "url(#".concat(clipPathId, ")"),
    };
    var clipPathProps = {
        id: clipPathId,
    };
    var chartsAxisProps = {
        slots: slots,
        slotProps: slotProps,
    };
    var legendProps = {
        slots: __assign(__assign({}, slots), { legend: (_e = slots === null || slots === void 0 ? void 0 : slots.legend) !== null && _e !== void 0 ? _e : ChartsLegend_1.ContinuousColorLegend }),
        slotProps: { legend: __assign({ labelPosition: 'extremes' }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.legend) },
        sx: ((_f = slotProps === null || slotProps === void 0 ? void 0 : slotProps.legend) === null || _f === void 0 ? void 0 : _f.direction) === 'vertical' ? { height: 150 } : { width: '50%' },
    };
    return {
        chartsDataProviderProProps: chartsDataProviderProProps,
        chartsWrapperProps: chartsWrapperProps,
        heatmapPlotProps: heatmapPlotProps,
        clipPathProps: clipPathProps,
        clipPathGroupProps: clipPathGroupProps,
        overlayProps: overlayProps,
        chartsAxisProps: chartsAxisProps,
        legendProps: legendProps,
        children: children,
    };
}
