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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiPieChart' });
    var series = props.series, width = props.width, height = props.height, marginProps = props.margin, colors = props.colors, sx = props.sx, skipAnimation = props.skipAnimation, hideLegend = props.hideLegend, children = props.children, slots = props.slots, slotProps = props.slotProps, onItemClick = props.onItemClick, loading = props.loading, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, className = props.className, showToolbar = props.showToolbar, other = __rest(props, ["series", "width", "height", "margin", "colors", "sx", "skipAnimation", "hideLegend", "children", "slots", "slotProps", "onItemClick", "loading", "highlightedItem", "onHighlightChange", "className", "showToolbar"]);
    var margin = (0, defaultizeMargin_1.defaultizeMargin)(marginProps, constants_1.DEFAULT_PIE_CHART_MARGIN);
    var _m = (0, useChartContainerProps_1.useChartContainerProps)(__assign(__assign({}, other), { series: series.map(function (s) { return (__assign({ type: 'pie' }, s)); }), width: width, height: height, margin: margin, colors: colors, highlightedItem: highlightedItem, onHighlightChange: onHighlightChange, className: className, skipAnimation: skipAnimation, plugins: PieChart_plugins_1.PIE_CHART_PLUGINS }), ref), chartDataProviderProps = _m.chartDataProviderProps, chartsSurfaceProps = _m.chartsSurfaceProps;
    var Tooltip = (_a = slots === null || slots === void 0 ? void 0 : slots.tooltip) !== null && _a !== void 0 ? _a : ChartsTooltip_1.ChartsTooltip;
    var Toolbar = (_b = props.slots) === null || _b === void 0 ? void 0 : _b.toolbar;
    return (<ChartDataProvider_1.ChartDataProvider {...chartDataProviderProps}>
      <ChartsWrapper_1.ChartsWrapper legendPosition={(_d = (_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.legend) === null || _d === void 0 ? void 0 : _d.position} legendDirection={(_g = (_f = (_e = props.slotProps) === null || _e === void 0 ? void 0 : _e.legend) === null || _f === void 0 ? void 0 : _f.direction) !== null && _g !== void 0 ? _g : 'vertical'} sx={sx}>
        {showToolbar && Toolbar ? <Toolbar {...(_h = props.slotProps) === null || _h === void 0 ? void 0 : _h.toolbar}/> : null}
        {!hideLegend && (<ChartsLegend_1.ChartsLegend direction={(_l = (_k = (_j = props.slotProps) === null || _j === void 0 ? void 0 : _j.legend) === null || _k === void 0 ? void 0 : _k.direction) !== null && _l !== void 0 ? _l : 'vertical'} slots={slots} slotProps={slotProps}/>)}
        <ChartsSurface_1.ChartsSurface {...chartsSurfaceProps}>
          <PiePlot_1.PiePlot slots={slots} slotProps={slotProps} onItemClick={onItemClick}/>
          <ChartsOverlay_1.ChartsOverlay loading={loading} slots={slots} slotProps={slotProps}/>
          {children}
        </ChartsSurface_1.ChartsSurface>
        {!loading && <Tooltip trigger="item" {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.tooltip}/>}
      </ChartsWrapper_1.ChartsWrapper>
    </ChartDataProvider_1.ChartDataProvider>);
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
    /**
     * The height of the chart in px. If not defined, it takes the height of the parent element.
     */
    height: prop_types_1.default.number,
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
        seriesId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    }),
    /**
     * This prop is used to help implement the accessibility logic.
     * If you don't provide this prop. It falls back to a randomly generated id.
     */
    id: prop_types_1.default.string,
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
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
