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
exports.RadarChartPro = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var RadarChart_1 = require("@mui/x-charts/RadarChart");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var ChartsOverlay_1 = require("@mui/x-charts/ChartsOverlay");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var ChartsWrapper_1 = require("@mui/x-charts/ChartsWrapper");
var RadarChartPro_plugins_1 = require("./RadarChartPro.plugins");
var ChartsToolbarPro_1 = require("../ChartsToolbarPro");
/**
 * Demos:
 *
 * - [Radar Chart](https://mui.com/x/react-charts/radar/)
 *
 * API:
 *
 * - [RadarChart API](https://mui.com/x/api/charts/radar-chart/)
 */
var RadarChartPro = React.forwardRef(function RadarChartPro(inProps, ref) {
    var _a, _b, _c, _d, _e, _f;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiRadarChartPro' });
    var _g = (0, internals_1.useRadarChartProps)(props), chartsWrapperProps = _g.chartsWrapperProps, chartsSurfaceProps = _g.chartsSurfaceProps, radarDataProviderProps = _g.radarDataProviderProps, radarGrid = _g.radarGrid, overlayProps = _g.overlayProps, legendProps = _g.legendProps, highlight = _g.highlight, children = _g.children;
    var Tooltip = (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : ChartsTooltip_1.ChartsTooltip;
    var Toolbar = (_d = (_c = props.slots) === null || _c === void 0 ? void 0 : _c.toolbar) !== null && _d !== void 0 ? _d : ChartsToolbarPro_1.ChartsToolbarPro;
    var radarDataProviderProProps = __assign(__assign({}, radarDataProviderProps), { apiRef: radarDataProviderProps.apiRef, plugins: RadarChartPro_plugins_1.RADAR_CHART_PRO_PLUGINS });
    return ((0, jsx_runtime_1.jsx)(RadarChart_1.RadarDataProvider, __assign({}, radarDataProviderProProps, { children: (0, jsx_runtime_1.jsxs)(ChartsWrapper_1.ChartsWrapper, __assign({}, chartsWrapperProps, { ref: ref, children: [props.showToolbar ? (0, jsx_runtime_1.jsx)(Toolbar, __assign({}, (_e = props.slotProps) === null || _e === void 0 ? void 0 : _e.toolbar)) : null, !props.hideLegend && (0, jsx_runtime_1.jsx)(ChartsLegend_1.ChartsLegend, __assign({}, legendProps)), (0, jsx_runtime_1.jsxs)(ChartsSurface_1.ChartsSurface, __assign({}, chartsSurfaceProps, { children: [(0, jsx_runtime_1.jsx)(RadarChart_1.RadarGrid, __assign({}, radarGrid)), (0, jsx_runtime_1.jsx)(RadarChart_1.RadarMetricLabels, {}), (0, jsx_runtime_1.jsx)(RadarChart_1.RadarSeriesArea, {}), highlight === 'axis' && (0, jsx_runtime_1.jsx)(RadarChart_1.RadarAxisHighlight, {}), (0, jsx_runtime_1.jsx)(RadarChart_1.RadarSeriesMarks, {}), (0, jsx_runtime_1.jsx)(ChartsOverlay_1.ChartsOverlay, __assign({}, overlayProps)), children] })), !props.loading && (0, jsx_runtime_1.jsx)(Tooltip, __assign({}, (_f = props.slotProps) === null || _f === void 0 ? void 0 : _f.tooltip))] })) })));
});
exports.RadarChartPro = RadarChartPro;
RadarChartPro.propTypes = {
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
     * The number of divisions in the radar grid.
     * @default 5
     */
    divisions: prop_types_1.default.number,
    /**
     * Options to enable features planned for the next major.
     */
    experimentalFeatures: prop_types_1.default.object,
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
            type: prop_types_1.default.oneOf(['radar']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['radar']),
        }),
    ]).isRequired),
    /**
     * If `true`, the legend is not rendered.
     */
    hideLegend: prop_types_1.default.bool,
    /**
     * Indicates if the chart should highlight items per axis or per series.
     * @default 'axis'
     */
    highlight: prop_types_1.default.oneOf(['axis', 'none', 'series']),
    /**
     * The highlighted item.
     * Used when the highlight is controlled.
     */
    highlightedItem: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['radar']).isRequired,
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
            type: prop_types_1.default.oneOf(['radar']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['radar']),
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
     * Callback fired when an area is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
     */
    onAreaClick: prop_types_1.default.func,
    /**
     * The function called for onClick events.
     * The second argument contains information about all line/bar elements at the current mouse position.
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
     * Callback fired when a mark is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
     */
    onMarkClick: prop_types_1.default.func,
    /**
     * The callback fired when the tooltip item changes.
     *
     * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
     */
    onTooltipItemChange: prop_types_1.default.func,
    /**
     * The configuration of the radar scales.
     */
    radar: prop_types_1.default.shape({
        labelFormatter: prop_types_1.default.func,
        labelGap: prop_types_1.default.number,
        max: prop_types_1.default.number,
        metrics: prop_types_1.default.oneOfType([
            prop_types_1.default.arrayOf(prop_types_1.default.string),
            prop_types_1.default.arrayOf(prop_types_1.default.shape({
                max: prop_types_1.default.number,
                min: prop_types_1.default.number,
                name: prop_types_1.default.string.isRequired,
            })),
        ]).isRequired,
        startAngle: prop_types_1.default.number,
    }).isRequired,
    /**
     * The series to display in the bar chart.
     * An array of [[RadarSeries]] objects.
     */
    series: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
    /**
     * The grid shape.
     * @default 'sharp'
     */
    shape: prop_types_1.default.oneOf(['circular', 'sharp']),
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
    /**
     * Get stripe fill color. Set it to `null` to remove stripes
     * @param {number} index The index of the stripe band.
     * @returns {string} The color to fill the stripe.
     * @default (index) => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'
     */
    stripeColor: prop_types_1.default.func,
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
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['radar']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
        }),
    ]),
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
