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
exports.ScatterChartPro = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var ChartsOverlay_1 = require("@mui/x-charts/ChartsOverlay");
var ScatterChart_1 = require("@mui/x-charts/ScatterChart");
var ChartsAxis_1 = require("@mui/x-charts/ChartsAxis");
var ChartsGrid_1 = require("@mui/x-charts/ChartsGrid");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var ChartsAxisHighlight_1 = require("@mui/x-charts/ChartsAxisHighlight");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var internals_1 = require("@mui/x-charts/internals");
var ChartsWrapper_1 = require("@mui/x-charts/ChartsWrapper");
var ChartsBrushOverlay_1 = require("@mui/x-charts/ChartsBrushOverlay");
var ChartsZoomSlider_1 = require("../ChartsZoomSlider");
var ChartsToolbarPro_1 = require("../ChartsToolbarPro");
var useChartsContainerProProps_1 = require("../ChartsContainerPro/useChartsContainerProProps");
var ChartsDataProviderPro_1 = require("../ChartsDataProviderPro");
var ScatterChartPro_plugins_1 = require("./ScatterChartPro.plugins");
/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [ScatterChart API](https://mui.com/x/api/charts/scatter-chart/)
 */
var ScatterChartPro = React.forwardRef(function ScatterChartPro(inProps, ref) {
    var _a, _b, _c, _d, _e, _f;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiScatterChartPro' });
    var initialZoom = props.initialZoom, zoomData = props.zoomData, onZoomChange = props.onZoomChange, apiRef = props.apiRef, showToolbar = props.showToolbar, other = __rest(props, ["initialZoom", "zoomData", "onZoomChange", "apiRef", "showToolbar"]);
    var _g = (0, internals_1.useScatterChartProps)(other), chartsWrapperProps = _g.chartsWrapperProps, chartsContainerProps = _g.chartsContainerProps, chartsAxisProps = _g.chartsAxisProps, gridProps = _g.gridProps, scatterPlotProps = _g.scatterPlotProps, overlayProps = _g.overlayProps, legendProps = _g.legendProps, axisHighlightProps = _g.axisHighlightProps, children = _g.children;
    var _h = (0, useChartsContainerProProps_1.useChartsContainerProProps)(__assign(__assign({}, chartsContainerProps), { initialZoom: initialZoom, zoomData: zoomData, onZoomChange: onZoomChange, apiRef: apiRef, plugins: ScatterChartPro_plugins_1.SCATTER_CHART_PRO_PLUGINS })), chartsDataProviderProProps = _h.chartsDataProviderProProps, chartsSurfaceProps = _h.chartsSurfaceProps;
    var Tooltip = (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : ChartsTooltip_1.ChartsTooltip;
    var Toolbar = (_d = (_c = props.slots) === null || _c === void 0 ? void 0 : _c.toolbar) !== null && _d !== void 0 ? _d : ChartsToolbarPro_1.ChartsToolbarPro;
    return ((0, jsx_runtime_1.jsx)(ChartsDataProviderPro_1.ChartsDataProviderPro, __assign({}, chartsDataProviderProProps, { children: (0, jsx_runtime_1.jsxs)(ChartsWrapper_1.ChartsWrapper, __assign({}, chartsWrapperProps, { ref: ref, children: [showToolbar ? (0, jsx_runtime_1.jsx)(Toolbar, __assign({}, (_e = props.slotProps) === null || _e === void 0 ? void 0 : _e.toolbar)) : null, !props.hideLegend && (0, jsx_runtime_1.jsx)(ChartsLegend_1.ChartsLegend, __assign({}, legendProps)), (0, jsx_runtime_1.jsxs)(ChartsSurface_1.ChartsSurface, __assign({}, chartsSurfaceProps, { children: [(0, jsx_runtime_1.jsx)(ChartsAxis_1.ChartsAxis, __assign({}, chartsAxisProps)), (0, jsx_runtime_1.jsx)(ChartsZoomSlider_1.ChartsZoomSlider, {}), (0, jsx_runtime_1.jsx)(ChartsGrid_1.ChartsGrid, __assign({}, gridProps)), (0, jsx_runtime_1.jsx)("g", { "data-drawing-container": true, children: (0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterPlot, __assign({}, scatterPlotProps)) }), (0, jsx_runtime_1.jsx)(ChartsOverlay_1.ChartsOverlay, __assign({}, overlayProps)), (0, jsx_runtime_1.jsx)(ChartsAxisHighlight_1.ChartsAxisHighlight, __assign({}, axisHighlightProps)), (0, jsx_runtime_1.jsx)(ChartsBrushOverlay_1.ChartsBrushOverlay, {}), children] })), !props.loading && (0, jsx_runtime_1.jsx)(Tooltip, __assign({ trigger: "item" }, (_f = props.slotProps) === null || _f === void 0 ? void 0 : _f.tooltip))] })) })));
});
exports.ScatterChartPro = ScatterChartPro;
ScatterChartPro.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.shape({
            exportAsImage: prop_types_1.default.func.isRequired,
            exportAsPrint: prop_types_1.default.func.isRequired,
            setAxisZoomData: prop_types_1.default.func.isRequired,
            setZoomData: prop_types_1.default.func.isRequired,
        }),
    }),
    /**
     * A gap added between axes when multiple axes are rendered on the same side of the chart.
     * @default 0
     */
    axesGap: prop_types_1.default.number,
    /**
     * The configuration of axes highlight.
     * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
     * @default { x: 'none', y: 'none' }
     */
    axisHighlight: prop_types_1.default.shape({
        x: prop_types_1.default.oneOf(['band', 'line', 'none']),
        y: prop_types_1.default.oneOf(['band', 'line', 'none']),
    }),
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
     * If true, the closest point interaction is disabled and falls back to hover events.
     * @default false
     * @deprecated Use `disableHitArea` instead.
     */
    disableClosestPoint: prop_types_1.default.bool,
    /**
     * If true, the hit area interaction is disabled and falls back to hover events.
     * @default false
     */
    disableHitArea: prop_types_1.default.bool,
    /**
     * If `true`, disables keyboard navigation for the chart.
     */
    disableKeyboardNavigation: prop_types_1.default.bool,
    /**
     * If true, the interaction will not use the Voronoi cell and fall back to hover events.
     * @default false
     * @deprecated Use `disableHitArea` instead.
     */
    disableVoronoi: prop_types_1.default.bool,
    /**
     * Options to enable features planned for the next major.
     */
    experimentalFeatures: prop_types_1.default.object,
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
    hiddenItems: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['scatter']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['scatter']),
        }),
    ]).isRequired),
    /**
     * If `true`, the legend is not rendered.
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
            type: prop_types_1.default.oneOf(['scatter']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
        }),
    ]),
    /**
     * Defines the maximum distance between a scatter point and the pointer that triggers the interaction.
     * If set to `'item'`, the radius is the `markerSize`.
     * If `undefined`, the radius is assumed to be infinite.
     */
    hitAreaRadius: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['item']), prop_types_1.default.number]),
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
            type: prop_types_1.default.oneOf(['scatter']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['scatter']),
        }),
    ]).isRequired),
    /**
     * The list of zoom data related to each axis.
     * Used to initialize the zoom in a specific configuration without controlling it.
     */
    initialZoom: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        end: prop_types_1.default.number.isRequired,
        start: prop_types_1.default.number.isRequired,
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
     * Callback fired when clicking on a scatter item.
     * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element if using hit area interaction. Or the Mouse event from the scatter element, when `disableHitArea=true`.
     * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * The function called when the pointer position corresponds to a new axis data item.
     * This update can either be caused by a pointer movement, or an axis update.
     * In case of multiple axes, the function is called if at least one axis is updated.
     * The argument contains the identifier for all axes with a `data` property.
     * @param {AxisItemIdentifier[]} axisItems The array of axes item identifiers.
     */
    onTooltipAxisChange: prop_types_1.default.func,
    /**
     * The callback fired when the tooltip item changes.
     *
     * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
     */
    onTooltipItemChange: prop_types_1.default.func,
    /**
     * Callback fired when the zoom has changed.
     *
     * @param {ZoomData[]} zoomData Updated zoom data.
     */
    onZoomChange: prop_types_1.default.func,
    /**
     * The type of renderer to use for the scatter plot.
     * - `svg-single`: Renders every scatter item in a `<circle />` element.
     * - `svg-batch`: Batch renders scatter items in `<path />` elements for better performance with large datasets, at the cost of some limitations.
     *                Read more: https://mui.com/x/react-charts/scatter/#performance
     *
     * @default 'svg-single'
     */
    renderer: prop_types_1.default.oneOf(['svg-batch', 'svg-single']),
    /**
     * The series to display in the scatter chart.
     * An array of [[ScatterSeries]] objects.
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
    /**
     * The title of the chart.
     * Used to provide an accessible label for the chart.
     */
    title: prop_types_1.default.string,
    /**
     * The controlled axis tooltip.
     * Identified by the axis id, and data index.
     */
    tooltipAxis: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        dataIndex: prop_types_1.default.number.isRequired,
    })),
    /**
     * The tooltip item.
     * Used when the tooltip is controlled.
     */
    tooltipItem: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number.isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['scatter']).isRequired,
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
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
            zoom: prop_types_1.default.oneOfType([
                prop_types_1.default.shape({
                    filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                    maxEnd: prop_types_1.default.number,
                    maxSpan: prop_types_1.default.number,
                    minSpan: prop_types_1.default.number,
                    minStart: prop_types_1.default.number,
                    panning: prop_types_1.default.bool,
                    slider: prop_types_1.default.shape({
                        enabled: prop_types_1.default.bool,
                        preview: prop_types_1.default.bool,
                        showTooltip: prop_types_1.default.oneOf(['always', 'hover', 'never']),
                        size: prop_types_1.default.number,
                    }),
                    step: prop_types_1.default.number,
                }),
                prop_types_1.default.bool,
            ]),
        }),
    ]).isRequired),
    /**
     * The configuration of the z-axes.
     */
    zAxis: prop_types_1.default.arrayOf(prop_types_1.default.shape({
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
        id: prop_types_1.default.string,
        max: prop_types_1.default.number,
        min: prop_types_1.default.number,
    })),
    /**
     * The list of zoom data related to each axis.
     */
    zoomData: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        end: prop_types_1.default.number.isRequired,
        start: prop_types_1.default.number.isRequired,
    })),
    /**
     * Configuration for zoom interactions.
     */
    zoomInteractionConfig: prop_types_1.default.shape({
        pan: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
            prop_types_1.default.oneOf(['drag', 'pressAndDrag', 'wheel']),
            prop_types_1.default.shape({
                pointerMode: prop_types_1.default.oneOf(['mouse', 'touch']),
                requiredKeys: prop_types_1.default.arrayOf(prop_types_1.default.string),
                type: prop_types_1.default.oneOf(['drag']).isRequired,
            }),
            prop_types_1.default.shape({
                pointerMode: prop_types_1.default.oneOf(['mouse', 'touch']),
                requiredKeys: prop_types_1.default.arrayOf(prop_types_1.default.string),
                type: prop_types_1.default.oneOf(['pressAndDrag']).isRequired,
            }),
            prop_types_1.default.shape({
                allowedDirection: prop_types_1.default.oneOf(['x', 'xy', 'y']),
                pointerMode: prop_types_1.default.any,
                requiredKeys: prop_types_1.default.arrayOf(prop_types_1.default.string),
                type: prop_types_1.default.oneOf(['wheel']).isRequired,
            }),
        ]).isRequired),
        zoom: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
            prop_types_1.default.oneOf(['brush', 'doubleTapReset', 'pinch', 'tapAndDrag', 'wheel']),
            prop_types_1.default.shape({
                pointerMode: prop_types_1.default.any,
                requiredKeys: prop_types_1.default.arrayOf(prop_types_1.default.string),
                type: prop_types_1.default.oneOf(['wheel']).isRequired,
            }),
            prop_types_1.default.shape({
                pointerMode: prop_types_1.default.any,
                requiredKeys: prop_types_1.default.array,
                type: prop_types_1.default.oneOf(['pinch']).isRequired,
            }),
            prop_types_1.default.shape({
                pointerMode: prop_types_1.default.oneOf(['mouse', 'touch']),
                requiredKeys: prop_types_1.default.arrayOf(prop_types_1.default.string),
                type: prop_types_1.default.oneOf(['tapAndDrag']).isRequired,
            }),
            prop_types_1.default.shape({
                pointerMode: prop_types_1.default.oneOf(['mouse', 'touch']),
                requiredKeys: prop_types_1.default.arrayOf(prop_types_1.default.string),
                type: prop_types_1.default.oneOf(['doubleTapReset']).isRequired,
            }),
            prop_types_1.default.shape({
                pointerMode: prop_types_1.default.oneOf(['mouse', 'touch']),
                requiredKeys: prop_types_1.default.arrayOf(prop_types_1.default.string),
                type: prop_types_1.default.oneOf(['brush']).isRequired,
            }),
        ]).isRequired),
    }),
};
