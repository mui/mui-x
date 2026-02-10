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
exports.BarChart = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var BarPlot_1 = require("./BarPlot");
var ChartsAxis_1 = require("../ChartsAxis");
var ChartsTooltip_1 = require("../ChartsTooltip");
var ChartsLegend_1 = require("../ChartsLegend");
var ChartsAxisHighlight_1 = require("../ChartsAxisHighlight");
var ChartsClipPath_1 = require("../ChartsClipPath");
var ChartsGrid_1 = require("../ChartsGrid");
var ChartsOverlay_1 = require("../ChartsOverlay/ChartsOverlay");
var useBarChartProps_1 = require("./useBarChartProps");
var ChartDataProvider_1 = require("../ChartDataProvider");
var ChartsSurface_1 = require("../ChartsSurface");
var useChartContainerProps_1 = require("../ChartContainer/useChartContainerProps");
var ChartsWrapper_1 = require("../ChartsWrapper");
var FocusedBar_1 = require("./FocusedBar");
/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarChart API](https://mui.com/x/api/charts/bar-chart/)
 */
var BarChart = React.forwardRef(function BarChart(inProps, ref) {
    var _a, _b, _c, _d, _e;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiBarChart' });
    var _f = (0, useBarChartProps_1.useBarChartProps)(props), chartsWrapperProps = _f.chartsWrapperProps, chartContainerProps = _f.chartContainerProps, barPlotProps = _f.barPlotProps, gridProps = _f.gridProps, clipPathProps = _f.clipPathProps, clipPathGroupProps = _f.clipPathGroupProps, overlayProps = _f.overlayProps, chartsAxisProps = _f.chartsAxisProps, axisHighlightProps = _f.axisHighlightProps, legendProps = _f.legendProps, children = _f.children;
    var _g = (0, useChartContainerProps_1.useChartContainerProps)(chartContainerProps, ref), chartDataProviderProps = _g.chartDataProviderProps, chartsSurfaceProps = _g.chartsSurfaceProps;
    var Tooltip = (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : ChartsTooltip_1.ChartsTooltip;
    var Toolbar = (_c = props.slots) === null || _c === void 0 ? void 0 : _c.toolbar;
    return ((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, __assign({}, chartDataProviderProps, { children: (0, jsx_runtime_1.jsxs)(ChartsWrapper_1.ChartsWrapper, __assign({}, chartsWrapperProps, { children: [props.showToolbar && Toolbar ? (0, jsx_runtime_1.jsx)(Toolbar, __assign({}, (_d = props.slotProps) === null || _d === void 0 ? void 0 : _d.toolbar)) : null, !props.hideLegend && (0, jsx_runtime_1.jsx)(ChartsLegend_1.ChartsLegend, __assign({}, legendProps)), (0, jsx_runtime_1.jsxs)(ChartsSurface_1.ChartsSurface, __assign({}, chartsSurfaceProps, { children: [(0, jsx_runtime_1.jsx)(ChartsGrid_1.ChartsGrid, __assign({}, gridProps)), (0, jsx_runtime_1.jsxs)("g", __assign({}, clipPathGroupProps, { children: [(0, jsx_runtime_1.jsx)(BarPlot_1.BarPlot, __assign({}, barPlotProps)), (0, jsx_runtime_1.jsx)(ChartsOverlay_1.ChartsOverlay, __assign({}, overlayProps)), (0, jsx_runtime_1.jsx)(ChartsAxisHighlight_1.ChartsAxisHighlight, __assign({}, axisHighlightProps)), (0, jsx_runtime_1.jsx)(FocusedBar_1.FocusedBar, {})] })), (0, jsx_runtime_1.jsx)(ChartsAxis_1.ChartsAxis, __assign({}, chartsAxisProps)), (0, jsx_runtime_1.jsx)(ChartsClipPath_1.ChartsClipPath, __assign({}, clipPathProps)), children] })), !props.loading && (0, jsx_runtime_1.jsx)(Tooltip, __assign({}, (_e = props.slotProps) === null || _e === void 0 ? void 0 : _e.tooltip))] })) })));
});
exports.BarChart = BarChart;
BarChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.object,
    }),
    /**
     * A gap added between axes when multiple axes are rendered on the same side of the chart.
     * @default 0
     */
    axesGap: prop_types_1.default.number,
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
     * @deprecated Use `barLabel` in the chart series instead.
     * If provided, the function will be used to format the label of the bar.
     * It can be set to 'value' to display the current value.
     * @param {BarItem} item The item to format.
     * @param {BarLabelContext} context data about the bar.
     * @returns {string} The formatted label.
     */
    barLabel: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['value']), prop_types_1.default.func]),
    /**
     * Defines the border radius of the bar element.
     */
    borderRadius: prop_types_1.default.number,
    /**
     * Configuration for the brush interaction.
     */
    brushConfig: prop_types_1.default.shape({
        enabled: prop_types_1.default.bool,
        preventHighlight: prop_types_1.default.bool,
        preventTooltip: prop_types_1.default.bool,
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
     * If `true`, the charts will not listen to the mouse move event.
     * It might break interactive features, but will improve performance.
     * @default false
     */
    disableAxisListener: prop_types_1.default.bool,
    enableKeyboardNavigation: prop_types_1.default.bool,
    /**
     * Option to display a cartesian grid in the background.
     */
    grid: prop_types_1.default.shape({
        horizontal: prop_types_1.default.bool,
        vertical: prop_types_1.default.bool,
    }),
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
        type: prop_types_1.default.oneOf(['bar']).isRequired,
    })),
    /**
     * If `true`, the legend is not rendered.
     */
    hideLegend: prop_types_1.default.bool,
    /**
     * The controlled axis highlight.
     * Identified by the axis id, and data index.
     */
    highlightedAxis: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        dataIndex: prop_types_1.default.number.isRequired,
    })),
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
        type: prop_types_1.default.oneOf(['bar']).isRequired,
    })),
    /**
     * The direction of the bar elements.
     * @default 'vertical'
     */
    layout: prop_types_1.default.oneOf(['horizontal', 'vertical']),
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
     * The second argument contains information about all line/bar elements at the current mouse position.
     * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
     * @param {null | ChartsAxisData} data The data about the clicked axis and items associated with it.
     */
    onAxisClick: prop_types_1.default.func,
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
     * The function called when the pointer position corresponds to a new axis data item.
     * This update can either be caused by a pointer movement, or an axis update.
     * In case of multiple axes, the function is called if at least one axis is updated.
     * The argument contains the identifier for all axes with a `data` property.
     * @param {AxisItemIdentifier[]} axisItems The array of axes item identifiers.
     */
    onHighlightedAxisChange: prop_types_1.default.func,
    /**
     * Callback fired when a bar item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * The callback fired when the tooltip item changes.
     *
     * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
     */
    onTooltipItemChange: prop_types_1.default.func,
    /**
     * The type of renderer to use for the bar plot.
     * - `svg-single`: Renders every bar in a `<rect />` element.
     * - `svg-batch`: Batch renders bars in `<path />` elements for better performance with large datasets, at the cost of some limitations.
     *                Read more: https://mui.com/x/react-charts/bars/#performance
     *
     * @default 'svg-single'
     */
    renderer: prop_types_1.default.oneOf(['svg-batch', 'svg-single']),
    /**
     * The series to display in the bar chart.
     * An array of [[BarSeries]] objects.
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
        type: prop_types_1.default.oneOf(['bar']).isRequired,
    }),
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
    /**
     * The configuration of the x-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    xAxis: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            barGapRatio: prop_types_1.default.number,
            categoryGapRatio: prop_types_1.default.number,
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    type: prop_types_1.default.oneOf(['ordinal']).isRequired,
                    unknownColor: prop_types_1.default.string,
                    values: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string])
                        .isRequired),
                }),
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            groups: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                getValue: prop_types_1.default.func.isRequired,
                tickLabelStyle: prop_types_1.default.object,
                tickSize: prop_types_1.default.number,
            })),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            offset: prop_types_1.default.number,
            ordinalTimeTicks: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
                prop_types_1.default.shape({
                    format: prop_types_1.default.func.isRequired,
                    getTickNumber: prop_types_1.default.func.isRequired,
                    isTick: prop_types_1.default.func.isRequired,
                }),
            ]).isRequired),
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['band']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    type: prop_types_1.default.oneOf(['ordinal']).isRequired,
                    unknownColor: prop_types_1.default.string,
                    values: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string])
                        .isRequired),
                }),
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            groups: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                getValue: prop_types_1.default.func.isRequired,
                tickLabelStyle: prop_types_1.default.object,
                tickSize: prop_types_1.default.number,
            })),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            offset: prop_types_1.default.number,
            ordinalTimeTicks: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
                prop_types_1.default.shape({
                    format: prop_types_1.default.func.isRequired,
                    getTickNumber: prop_types_1.default.func.isRequired,
                    isTick: prop_types_1.default.func.isRequired,
                }),
            ]).isRequired),
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['point']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['log']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            constant: prop_types_1.default.number,
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['symlog']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['pow']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['sqrt']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.oneOfType([
                prop_types_1.default.number,
                prop_types_1.default.shape({
                    valueOf: prop_types_1.default.func.isRequired,
                }),
            ]),
            min: prop_types_1.default.oneOfType([
                prop_types_1.default.number,
                prop_types_1.default.shape({
                    valueOf: prop_types_1.default.func.isRequired,
                }),
            ]),
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['time']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.oneOfType([
                prop_types_1.default.number,
                prop_types_1.default.shape({
                    valueOf: prop_types_1.default.func.isRequired,
                }),
            ]),
            min: prop_types_1.default.oneOfType([
                prop_types_1.default.number,
                prop_types_1.default.shape({
                    valueOf: prop_types_1.default.func.isRequired,
                }),
            ]),
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['utc']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['x']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['linear']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelMinGap: prop_types_1.default.number,
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
        }),
    ]).isRequired),
    /**
     * The configuration of the y-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    yAxis: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            barGapRatio: prop_types_1.default.number,
            categoryGapRatio: prop_types_1.default.number,
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    type: prop_types_1.default.oneOf(['ordinal']).isRequired,
                    unknownColor: prop_types_1.default.string,
                    values: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string])
                        .isRequired),
                }),
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            groups: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                getValue: prop_types_1.default.func.isRequired,
                tickLabelStyle: prop_types_1.default.object,
                tickSize: prop_types_1.default.number,
            })),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            offset: prop_types_1.default.number,
            ordinalTimeTicks: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
                prop_types_1.default.shape({
                    format: prop_types_1.default.func.isRequired,
                    getTickNumber: prop_types_1.default.func.isRequired,
                    isTick: prop_types_1.default.func.isRequired,
                }),
            ]).isRequired),
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['band']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    type: prop_types_1.default.oneOf(['ordinal']).isRequired,
                    unknownColor: prop_types_1.default.string,
                    values: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number, prop_types_1.default.string])
                        .isRequired),
                }),
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            groups: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                getValue: prop_types_1.default.func.isRequired,
                tickLabelStyle: prop_types_1.default.object,
                tickSize: prop_types_1.default.number,
            })),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            offset: prop_types_1.default.number,
            ordinalTimeTicks: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['biweekly', 'days', 'hours', 'months', 'quarterly', 'weeks', 'years']),
                prop_types_1.default.shape({
                    format: prop_types_1.default.func.isRequired,
                    getTickNumber: prop_types_1.default.func.isRequired,
                    isTick: prop_types_1.default.func.isRequired,
                }),
            ]).isRequired),
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['point']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['log']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            constant: prop_types_1.default.number,
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['symlog']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['pow']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['sqrt']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.oneOfType([
                prop_types_1.default.number,
                prop_types_1.default.shape({
                    valueOf: prop_types_1.default.func.isRequired,
                }),
            ]),
            min: prop_types_1.default.oneOfType([
                prop_types_1.default.number,
                prop_types_1.default.shape({
                    valueOf: prop_types_1.default.func.isRequired,
                }),
            ]),
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['time']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.oneOfType([
                prop_types_1.default.number,
                prop_types_1.default.shape({
                    valueOf: prop_types_1.default.func.isRequired,
                }),
            ]),
            min: prop_types_1.default.oneOfType([
                prop_types_1.default.number,
                prop_types_1.default.shape({
                    valueOf: prop_types_1.default.func.isRequired,
                }),
            ]),
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['utc']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
        prop_types_1.default.shape({
            axis: prop_types_1.default.oneOf(['y']),
            classes: prop_types_1.default.object,
            colorMap: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    color: prop_types_1.default.oneOfType([
                        prop_types_1.default.arrayOf(prop_types_1.default.string.isRequired),
                        prop_types_1.default.func,
                    ]).isRequired,
                    max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
                    type: prop_types_1.default.oneOf(['continuous']).isRequired,
                }),
                prop_types_1.default.shape({
                    colors: prop_types_1.default.arrayOf(prop_types_1.default.string).isRequired,
                    thresholds: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]).isRequired).isRequired,
                    type: prop_types_1.default.oneOf(['piecewise']).isRequired,
                }),
            ]),
            data: prop_types_1.default.array,
            dataKey: prop_types_1.default.string,
            disableLine: prop_types_1.default.bool,
            disableTicks: prop_types_1.default.bool,
            domainLimit: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['nice', 'strict']), prop_types_1.default.func]),
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['left', 'none', 'right']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['linear']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            sx: prop_types_1.default.oneOfType([
                prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
                prop_types_1.default.func,
                prop_types_1.default.object,
            ]),
            tickInterval: prop_types_1.default.oneOfType([
                prop_types_1.default.oneOf(['auto']),
                prop_types_1.default.array,
                prop_types_1.default.func,
            ]),
            tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
            tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
            tickLabelStyle: prop_types_1.default.object,
            tickMaxStep: prop_types_1.default.number,
            tickMinStep: prop_types_1.default.number,
            tickNumber: prop_types_1.default.number,
            tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
            tickSize: prop_types_1.default.number,
            tickSpacing: prop_types_1.default.number,
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
        }),
    ]).isRequired),
};
