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
exports.useSankeyChartProps = void 0;
var constants_1 = require("@mui/x-charts/constants");
var internals_1 = require("@mui/x-charts/internals");
var SankeyChart_plugins_1 = require("./SankeyChart.plugins");
/**
 * A helper function that extracts SankeyChartProps from the input props
 * and returns an object with props for the children components of SankeyChart.
 *
 * @param props The input props for SankeyChart
 * @returns An object with props for the children components of SankeyChart
 */
var useSankeyChartProps = function (props) {
    var series = props.series, width = props.width, height = props.height, marginProps = props.margin, colors = props.colors, sx = props.sx, children = props.children, slots = props.slots, slotProps = props.slotProps, loading = props.loading, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, className = props.className, apiRef = props.apiRef, onNodeClick = props.onNodeClick, onLinkClick = props.onLinkClick, other = __rest(props, ["series", "width", "height", "margin", "colors", "sx", "children", "slots", "slotProps", "loading", "highlightedItem", "onHighlightChange", "className", "apiRef", "onNodeClick", "onLinkClick"]);
    var margin = (0, internals_1.defaultizeMargin)(marginProps, constants_1.DEFAULT_MARGINS);
    var chartsContainerProps = __assign(__assign({}, other), { series: [
            __assign({ type: 'sankey' }, series),
        ], width: width, height: height, margin: margin, colors: colors, sx: sx, highlightedItem: highlightedItem, onHighlightChange: onHighlightChange, apiRef: apiRef, plugins: SankeyChart_plugins_1.SANKEY_CHART_PLUGINS });
    var sankeyPlotProps = {
        onNodeClick: onNodeClick,
        onLinkClick: onLinkClick,
    };
    var overlayProps = {
        slots: slots,
        slotProps: slotProps,
        loading: loading,
    };
    var chartsWrapperProps = {
        sx: sx,
        hideLegend: false,
        className: className,
    };
    return {
        chartsContainerProps: chartsContainerProps,
        sankeyPlotProps: sankeyPlotProps,
        overlayProps: overlayProps,
        chartsWrapperProps: chartsWrapperProps,
        children: children,
    };
};
exports.useSankeyChartProps = useSankeyChartProps;
