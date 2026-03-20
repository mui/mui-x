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
exports.useCandlestickChartProps = useCandlestickChartProps;
var React = require("react");
var useId_1 = require("@mui/utils/useId");
var CandlestickChart_plugins_1 = require("./CandlestickChart.plugins");
/**
 * A helper function that extracts CandlestickChartProps from the input props
 * and returns an object with props for the children components of CandlestickChart.
 *
 * @param props The input props for CandlestickChart
 * @returns An object with props for the children components of CandlestickChart
 */
function useCandlestickChartProps(props) {
    var _a, _b;
    var xAxis = props.xAxis, yAxis = props.yAxis, series = props.series, width = props.width, height = props.height, margin = props.margin, colors = props.colors, dataset = props.dataset, sx = props.sx, grid = props.grid, children = props.children, slots = props.slots, slotProps = props.slotProps, skipAnimation = props.skipAnimation, loading = props.loading, className = props.className, axisHighlight = props.axisHighlight, other = __rest(props, ["xAxis", "yAxis", "series", "width", "height", "margin", "colors", "dataset", "sx", "grid", "children", "slots", "slotProps", "skipAnimation", "loading", "className", "axisHighlight"]);
    var id = (0, useId_1.default)();
    var clipPathId = "".concat(id, "-clip-path");
    var xAxisWithDefault = React.useMemo(function () {
        return xAxis === null || xAxis === void 0 ? void 0 : xAxis.map(function (axis) { return (__assign({ scaleType: 'band', ordinalTimeTicks: ['years', 'quarterly', 'months', 'biweekly', 'weeks', 'days', 'hours'] }, axis)); });
    }, [xAxis]);
    var seriesWithDefault = React.useMemo(function () {
        return series.map(function (s) { return (__assign({ type: 'ohlc' }, s)); });
    }, [series]);
    var axisHighlightProps = __assign(__assign({}, axisHighlight), { x: (_a = axisHighlight === null || axisHighlight === void 0 ? void 0 : axisHighlight.x) !== null && _a !== void 0 ? _a : 'line', y: (_b = axisHighlight === null || axisHighlight === void 0 ? void 0 : axisHighlight.y) !== null && _b !== void 0 ? _b : 'line' });
    var chartsContainerProps = __assign(__assign({}, other), { series: seriesWithDefault, width: width, height: height, margin: margin, colors: colors, dataset: dataset, xAxis: xAxisWithDefault, yAxis: yAxis, disableAxisListener: axisHighlightProps.x === 'none' && axisHighlightProps.y === 'none', className: className, skipAnimation: skipAnimation, plugins: CandlestickChart_plugins_1.CANDLESTICK_CHART_PLUGINS });
    var candlestickPlotProps = {
        slots: slots,
        slotProps: slotProps,
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
    var chartsWrapperProps = {
        sx: sx,
    };
    var legendProps = {
        slots: slots,
        slotProps: slotProps,
    };
    return {
        chartsWrapperProps: chartsWrapperProps,
        chartsContainerProps: chartsContainerProps,
        candlestickPlotProps: candlestickPlotProps,
        gridProps: gridProps,
        clipPathProps: clipPathProps,
        clipPathGroupProps: clipPathGroupProps,
        overlayProps: overlayProps,
        chartsAxisProps: chartsAxisProps,
        axisHighlightProps: axisHighlightProps,
        legendProps: legendProps,
        children: children,
    };
}
