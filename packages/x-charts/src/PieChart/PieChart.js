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
exports.PieChart = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var constants_1 = require("../internals/constants");
var ChartsTooltip_1 = require("../ChartsTooltip");
var ChartsLegend_1 = require("../ChartsLegend");
var PiePlot_1 = require("./PiePlot");
var ChartsOverlay_1 = require("../ChartsOverlay");
var ChartsSurface_1 = require("../ChartsSurface");
var ChartDataProvider_1 = require("../ChartDataProvider");
var useChartContainerProps_1 = require("../ChartContainer/useChartContainerProps");
var ChartsWrapper_1 = require("../ChartsWrapper");
var PieChart_plugins_1 = require("./PieChart.plugins");
var defaultizeMargin_1 = require("../internals/defaultizeMargin");
var FocusedPieArc_1 = require("./FocusedPieArc");
/**
 * Demos:
 *
 * - [Pie](https://mui.com/x/react-charts/pie/)
 * - [Pie demonstration](https://mui.com/x/react-charts/pie-demo/)
 *
 * API:
 *
 * - [PieChart API](https://mui.com/x/api/charts/pie-chart/)
 */
var PieChart = React.forwardRef(function PieChart(inProps, ref) {
    var _a, _b, _c, _d, _e, _f;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPieChart' });
    var series = props.series, width = props.width, height = props.height, marginProps = props.margin, colors = props.colors, sx = props.sx, skipAnimation = props.skipAnimation, hideLegend = props.hideLegend, children = props.children, slots = props.slots, slotProps = props.slotProps, onItemClick = props.onItemClick, loading = props.loading, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, className = props.className, showToolbar = props.showToolbar, other = __rest(props, ["series", "width", "height", "margin", "colors", "sx", "skipAnimation", "hideLegend", "children", "slots", "slotProps", "onItemClick", "loading", "highlightedItem", "onHighlightChange", "className", "showToolbar"]);
    var margin = (0, defaultizeMargin_1.defaultizeMargin)(marginProps, constants_1.DEFAULT_PIE_CHART_MARGIN);
    var _g = (0, useChartContainerProps_1.useChartContainerProps)(__assign(__assign({}, other), { series: series.map(function (s) { return (__assign({ type: 'pie' }, s)); }), width: width, height: height, margin: margin, colors: colors, highlightedItem: highlightedItem, onHighlightChange: onHighlightChange, className: className, skipAnimation: skipAnimation, plugins: PieChart_plugins_1.PIE_CHART_PLUGINS }), ref), chartDataProviderProps = _g.chartDataProviderProps, chartsSurfaceProps = _g.chartsSurfaceProps;
    var Tooltip = (_a = slots === null || slots === void 0 ? void 0 : slots.tooltip) !== null && _a !== void 0 ? _a : ChartsTooltip_1.ChartsTooltip;
    var Toolbar = slots === null || slots === void 0 ? void 0 : slots.toolbar;
    return ((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, __assign({}, chartDataProviderProps, { children: (0, jsx_runtime_1.jsxs)(ChartsWrapper_1.ChartsWrapper, { legendPosition: (_b = slotProps === null || slotProps === void 0 ? void 0 : slotProps.legend) === null || _b === void 0 ? void 0 : _b.position, legendDirection: (_d = (_c = slotProps === null || slotProps === void 0 ? void 0 : slotProps.legend) === null || _c === void 0 ? void 0 : _c.direction) !== null && _d !== void 0 ? _d : 'vertical', sx: sx, hideLegend: hideLegend !== null && hideLegend !== void 0 ? hideLegend : false, children: [showToolbar && Toolbar ? (0, jsx_runtime_1.jsx)(Toolbar, __assign({}, slotProps === null || slotProps === void 0 ? void 0 : slotProps.toolbar)) : null, !hideLegend && ((0, jsx_runtime_1.jsx)(ChartsLegend_1.ChartsLegend, { direction: (_f = (_e = slotProps === null || slotProps === void 0 ? void 0 : slotProps.legend) === null || _e === void 0 ? void 0 : _e.direction) !== null && _f !== void 0 ? _f : 'vertical', slots: slots, slotProps: slotProps })), (0, jsx_runtime_1.jsxs)(ChartsSurface_1.ChartsSurface, __assign({}, chartsSurfaceProps, { children: [(0, jsx_runtime_1.jsx)(PiePlot_1.PiePlot, { slots: slots, slotProps: slotProps, onItemClick: onItemClick }), (0, jsx_runtime_1.jsx)(FocusedPieArc_1.FocusedPieArc, {}), (0, jsx_runtime_1.jsx)(ChartsOverlay_1.ChartsOverlay, { loading: loading, slots: slots, slotProps: slotProps }), children] })), !loading && (0, jsx_runtime_1.jsx)(Tooltip, __assign({ trigger: "item" }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.tooltip))] }) })));
});
exports.PieChart = PieChart;
PieChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.object,
    }),
    children: prop_types_1.default.node,
    className: prop_types_1.default.string,
    /**
     * Color palette used to colorize multiple series.
     * @default rainbowSurgePalette
     */
    colors: prop_types_1.default.oneOfType([prop_types_1.default.arrayOf(prop_types_1.default.string), prop_types_1.default.func]),
    /**
     * An array of objects that can be used to populate series and axes data using their `dataKey` property.
     */
    dataset: prop_types_1.default.arrayOf(prop_types_1.default.object),
    desc: prop_types_1.default.string,
    enableKeyboardNavigation: prop_types_1.default.bool,
    /**
     * The height of the chart in px. If not defined, it takes the height of the parent element.
     */
    height: prop_types_1.default.number,
    /**
     * List of hidden series and/or items.
     *
     * Different chart types use different keys.
     *
     * @example
     * ```ts
     * [
     *   {
     *     type: 'pie',
     *     seriesId: 'series-1',
     *     dataIndex: 3,
     *   },
     *   {
     *     type: 'line',
     *     seriesId: 'series-2',
     *   }
     * ]
     * ```
     */
    hiddenItems: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        dataIndex: prop_types_1.default.number,
        seriesId: prop_types_1.default.string,
        type: prop_types_1.default.oneOf(['pie']).isRequired,
    })),
    /**
     * If `true`, the legend is not rendered.
     */
    hideLegend: prop_types_1.default.bool,
    /**
     * The highlighted item.
     * Used when the highlight is controlled.
     */
    highlightedItem: prop_types_1.default.shape({
        dataIndex: prop_types_1.default.number,
        seriesId: prop_types_1.default.string.isRequired,
    }),
    /**
     * This prop is used to help implement the accessibility logic.
     * If you don't provide this prop. It falls back to a randomly generated id.
     */
    id: prop_types_1.default.string,
    /**
     * List of initially hidden series and/or items.
     * Used for uncontrolled state.
     *
     * Different chart types use different keys.
     *
     * @example
     * ```ts
     * [
     *   {
     *     type: 'pie',
     *     seriesId: 'series-1',
     *     dataIndex: 3,
     *   },
     *   {
     *     type: 'line',
     *     seriesId: 'series-2',
     *   }
     * ]
     * ```
     */
    initialHiddenItems: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        dataIndex: prop_types_1.default.number,
        seriesId: prop_types_1.default.string,
        type: prop_types_1.default.oneOf(['pie']).isRequired,
    })),
    /**
     * If `true`, a loading overlay is displayed.
     * @default false
     */
    loading: prop_types_1.default.bool,
    /**
     * Localized text for chart components.
     */
    localeText: prop_types_1.default.object,
    /**
     * The margin between the SVG and the drawing area.
     * It's used for leaving some space for extra information such as the x- and y-axis or legend.
     *
     * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
     */
    margin: prop_types_1.default.oneOfType([
        prop_types_1.default.number,
        prop_types_1.default.shape({
            bottom: prop_types_1.default.number,
            left: prop_types_1.default.number,
            right: prop_types_1.default.number,
            top: prop_types_1.default.number,
        }),
    ]),
    /**
     * Callback fired when any hidden identifiers change.
     * @param {VisibilityIdentifier[]} hiddenItems The new list of hidden identifiers.
     */
    onHiddenItemsChange: prop_types_1.default.func,
    /**
     * The callback fired when the highlighted item changes.
     *
     * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
     */
    onHighlightChange: prop_types_1.default.func,
    /**
     * Callback fired when a pie arc is clicked.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * The callback fired when the tooltip item changes.
     *
     * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
     */
    onTooltipItemChange: prop_types_1.default.func,
    /**
     * The series to display in the pie chart.
     * An array of [[PieSeries]] objects.
     */
    series: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
    /**
     * If true, shows the default chart toolbar.
     * @default false
     */
    showToolbar: prop_types_1.default.bool,
    /**
     * If `true`, animations are skipped.
     * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
     */
    skipAnimation: prop_types_1.default.bool,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    theme: prop_types_1.default.oneOf(['dark', 'light']),
    title: prop_types_1.default.string,
    /**
     * The tooltip item.
     * Used when the tooltip is controlled.
     */
    tooltipItem: prop_types_1.default.shape({
        dataIndex: prop_types_1.default.number.isRequired,
        seriesId: prop_types_1.default.string.isRequired,
        type: prop_types_1.default.oneOf(['pie']).isRequired,
    }),
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
