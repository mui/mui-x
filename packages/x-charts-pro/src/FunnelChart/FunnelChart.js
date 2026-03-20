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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunnelChart = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var ChartsOverlay_1 = require("@mui/x-charts/ChartsOverlay");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var ChartsAxisHighlight_1 = require("@mui/x-charts/ChartsAxisHighlight");
var ChartsAxis_1 = require("@mui/x-charts/ChartsAxis");
var ChartsWrapper_1 = require("@mui/x-charts/ChartsWrapper");
var FunnelPlot_1 = require("./FunnelPlot");
var useFunnelChartProps_1 = require("./useFunnelChartProps");
var seriesConfig_1 = require("./seriesConfig");
var useChartsContainerProProps_1 = require("../ChartsContainerPro/useChartsContainerProProps");
var ChartsDataProviderPro_1 = require("../ChartsDataProviderPro");
var FunnelChart_plugins_1 = require("./FunnelChart.plugins");
var FocusedFunnelSection_1 = require("./FocusedFunnelSection");
var seriesConfig = { funnel: seriesConfig_1.funnelSeriesConfig };
var FunnelChart = React.forwardRef(function FunnelChart(props, ref) {
    var _a, _b, _c;
    var themedProps = (0, styles_1.useThemeProps)({ props: props, name: 'MuiFunnelChart' });
    var _d = (0, useFunnelChartProps_1.useFunnelChartProps)(themedProps), chartsContainerProps = _d.chartsContainerProps, funnelPlotProps = _d.funnelPlotProps, overlayProps = _d.overlayProps, legendProps = _d.legendProps, chartsAxisProps = _d.chartsAxisProps, chartsWrapperProps = _d.chartsWrapperProps, axisHighlightProps = _d.axisHighlightProps, children = _d.children;
    var _e = (0, useChartsContainerProProps_1.useChartsContainerProProps)(chartsContainerProps), chartsDataProviderProProps = _e.chartsDataProviderProProps, chartsSurfaceProps = _e.chartsSurfaceProps;
    var Tooltip = (_b = (_a = themedProps.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : ChartsTooltip_1.ChartsTooltip;
    return ((0, jsx_runtime_1.jsx)(ChartsDataProviderPro_1.ChartsDataProviderPro, __assign({}, chartsDataProviderProProps, { gap: themedProps.gap, seriesConfig: seriesConfig, plugins: FunnelChart_plugins_1.FUNNEL_CHART_PLUGINS, children: (0, jsx_runtime_1.jsxs)(ChartsWrapper_1.ChartsWrapper, __assign({}, chartsWrapperProps, { ref: ref, children: [!themedProps.hideLegend && (0, jsx_runtime_1.jsx)(ChartsLegend_1.ChartsLegend, __assign({}, legendProps)), (0, jsx_runtime_1.jsxs)(ChartsSurface_1.ChartsSurface, __assign({}, chartsSurfaceProps, { children: [(0, jsx_runtime_1.jsx)(FunnelPlot_1.FunnelPlot, __assign({}, funnelPlotProps)), (0, jsx_runtime_1.jsx)(ChartsOverlay_1.ChartsOverlay, __assign({}, overlayProps)), (0, jsx_runtime_1.jsx)(ChartsAxisHighlight_1.ChartsAxisHighlight, __assign({}, axisHighlightProps)), (0, jsx_runtime_1.jsx)(ChartsAxis_1.ChartsAxis, __assign({}, chartsAxisProps)), (0, jsx_runtime_1.jsx)(FocusedFunnelSection_1.FocusedFunnelSection, {}), children] })), !themedProps.loading && (0, jsx_runtime_1.jsx)(Tooltip, __assign({ trigger: "item" }, (_c = themedProps.slotProps) === null || _c === void 0 ? void 0 : _c.tooltip))] })) })));
});
exports.FunnelChart = FunnelChart;
FunnelChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.shape({
            exportAsImage: prop_types_1.default.func.isRequired,
            exportAsPrint: prop_types_1.default.func.isRequired,
        }),
    }),
    /**
     * The configuration of axes highlight.
     * Default is set to 'band' in the bar direction.
     * Depends on `layout` prop.
     * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
     */
    axisHighlight: prop_types_1.default.shape({
        x: prop_types_1.default.oneOf(['band', 'line', 'none']),
        y: prop_types_1.default.oneOf(['band', 'line', 'none']),
    }),
    /**
     * The configuration of the category axis.
     *
     * @default { position: 'none' }
     */
    categoryAxis: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            categories: prop_types_1.default.arrayOf(prop_types_1.default.string),
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            position: prop_types_1.default.oneOf(['bottom', 'left', 'none', 'right', 'top']),
            scaleType: prop_types_1.default.oneOf(['band']),
            size: prop_types_1.default.number,
            tickLabelStyle: prop_types_1.default.object,
            tickSize: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            categories: prop_types_1.default.arrayOf(prop_types_1.default.string),
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            position: prop_types_1.default.oneOf(['bottom', 'left', 'none', 'right', 'top']),
            scaleType: prop_types_1.default.oneOf(['log']),
            size: prop_types_1.default.number,
            tickLabelStyle: prop_types_1.default.object,
            tickSize: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            categories: prop_types_1.default.arrayOf(prop_types_1.default.string),
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            position: prop_types_1.default.oneOf(['bottom', 'left', 'none', 'right', 'top']),
            scaleType: prop_types_1.default.oneOf(['symlog']),
            size: prop_types_1.default.number,
            tickLabelStyle: prop_types_1.default.object,
            tickSize: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            categories: prop_types_1.default.arrayOf(prop_types_1.default.string),
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            position: prop_types_1.default.oneOf(['bottom', 'left', 'none', 'right', 'top']),
            scaleType: prop_types_1.default.oneOf(['pow']),
            size: prop_types_1.default.number,
            tickLabelStyle: prop_types_1.default.object,
            tickSize: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            categories: prop_types_1.default.arrayOf(prop_types_1.default.string),
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            position: prop_types_1.default.oneOf(['bottom', 'left', 'none', 'right', 'top']),
            scaleType: prop_types_1.default.oneOf(['sqrt']),
            size: prop_types_1.default.number,
            tickLabelStyle: prop_types_1.default.object,
            tickSize: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            categories: prop_types_1.default.arrayOf(prop_types_1.default.string),
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            position: prop_types_1.default.oneOf(['bottom', 'left', 'none', 'right', 'top']),
            scaleType: prop_types_1.default.oneOf(['time']),
            size: prop_types_1.default.number,
            tickLabelStyle: prop_types_1.default.object,
            tickSize: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            categories: prop_types_1.default.arrayOf(prop_types_1.default.string),
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            position: prop_types_1.default.oneOf(['bottom', 'left', 'none', 'right', 'top']),
            scaleType: prop_types_1.default.oneOf(['utc']),
            size: prop_types_1.default.number,
            tickLabelStyle: prop_types_1.default.object,
            tickSize: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            categories: prop_types_1.default.arrayOf(prop_types_1.default.string),
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            position: prop_types_1.default.oneOf(['bottom', 'left', 'none', 'right', 'top']),
            scaleType: prop_types_1.default.oneOf(['linear']),
            size: prop_types_1.default.number,
            tickLabelStyle: prop_types_1.default.object,
            tickSize: prop_types_1.default.number,
        }),
    ]),
    className: prop_types_1.default.string,
    /**
     * Color palette used to colorize multiple series.
     * @default rainbowSurgePalette
     */
    colors: prop_types_1.default.oneOfType([prop_types_1.default.arrayOf(prop_types_1.default.string), prop_types_1.default.func]),
    /**
     * The description of the chart.
     * Used to provide an accessible description for the chart.
     */
    desc: prop_types_1.default.string,
    /**
     * If `true`, the charts will not listen to the mouse move event.
     * It might break interactive features, but will improve performance.
     * @default false
     */
    disableAxisListener: prop_types_1.default.bool,
    /**
     * If `true`, disables keyboard navigation for the chart.
     */
    disableKeyboardNavigation: prop_types_1.default.bool,
    /**
     * Options to enable features planned for the next major.
     */
    experimentalFeatures: prop_types_1.default.object,
    /**
     * The gap, in pixels, between funnel sections.
     * @default 0
     */
    gap: prop_types_1.default.number,
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
    hiddenItems: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['funnel']),
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['funnel']).isRequired,
        }),
    ]).isRequired),
    /**
     * If `true`, the legend is not rendered.
     * @default false
     */
    hideLegend: prop_types_1.default.bool,
    /**
     * The highlighted item.
     * Used when the highlight is controlled.
     */
    highlightedItem: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['funnel']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
        }),
    ]),
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
    initialHiddenItems: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['funnel']),
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['funnel']).isRequired,
        }),
    ]).isRequired),
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
     * The function called for onClick events.
     * The second argument contains information about all funnel elements at the current position.
     * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
     * @param {null | ChartsAxisData} data The data about the clicked axis and items associated with it.
     */
    onAxisClick: prop_types_1.default.func,
    /**
     * Callback fired when any hidden identifiers change.
     * @param {VisibilityIdentifierWithType[]} hiddenItems The new list of hidden identifiers.
     */
    onHiddenItemsChange: prop_types_1.default.func,
    /**
     * The callback fired when the highlighted item changes.
     *
     * @param {HighlightItemIdentifierWithType<SeriesType> | null} highlightedItem  The newly highlighted item.
     */
    onHighlightChange: prop_types_1.default.func,
    /**
     * Callback fired when a funnel item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * The callback fired when the tooltip item changes.
     *
     * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
     */
    onTooltipItemChange: prop_types_1.default.func,
    /**
     * The series to display in the funnel chart.
     * An array of [[FunnelSeries]] objects.
     */
    series: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
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
    /**
     * The title of the chart.
     * Used to provide an accessible label for the chart.
     */
    title: prop_types_1.default.string,
    /**
     * The tooltip item.
     * Used when the tooltip is controlled.
     */
    tooltipItem: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number.isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['funnel']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number.isRequired,
            seriesId: prop_types_1.default.string.isRequired,
        }),
    ]),
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
