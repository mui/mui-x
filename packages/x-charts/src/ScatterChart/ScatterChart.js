"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterChart = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var ScatterPlot_1 = require("./ScatterPlot");
var ChartsAxis_1 = require("../ChartsAxis");
var ChartsTooltip_1 = require("../ChartsTooltip");
var ChartsLegend_1 = require("../ChartsLegend");
var ChartsOverlay_1 = require("../ChartsOverlay");
var ChartsAxisHighlight_1 = require("../ChartsAxisHighlight");
var ChartsGrid_1 = require("../ChartsGrid");
var useScatterChartProps_1 = require("./useScatterChartProps");
var useChartContainerProps_1 = require("../ChartContainer/useChartContainerProps");
var ChartDataProvider_1 = require("../ChartDataProvider");
var ChartsSurface_1 = require("../ChartsSurface");
var ChartsWrapper_1 = require("../ChartsWrapper");
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
var ScatterChart = React.forwardRef(function ScatterChart(inProps, ref) {
    var _a, _b, _c, _d, _e;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiScatterChart' });
    var _f = (0, useScatterChartProps_1.useScatterChartProps)(props), chartsWrapperProps = _f.chartsWrapperProps, chartContainerProps = _f.chartContainerProps, chartsAxisProps = _f.chartsAxisProps, gridProps = _f.gridProps, scatterPlotProps = _f.scatterPlotProps, overlayProps = _f.overlayProps, legendProps = _f.legendProps, axisHighlightProps = _f.axisHighlightProps, children = _f.children;
    var _g = (0, useChartContainerProps_1.useChartContainerProps)(chartContainerProps, ref), chartDataProviderProps = _g.chartDataProviderProps, chartsSurfaceProps = _g.chartsSurfaceProps;
    var Tooltip = (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : ChartsTooltip_1.ChartsTooltip;
    var Toolbar = (_c = props.slots) === null || _c === void 0 ? void 0 : _c.toolbar;
    return (<ChartDataProvider_1.ChartDataProvider {...chartDataProviderProps}>
      <ChartsWrapper_1.ChartsWrapper {...chartsWrapperProps}>
        {props.showToolbar && Toolbar ? <Toolbar {...(_d = props.slotProps) === null || _d === void 0 ? void 0 : _d.toolbar}/> : null}
        {!props.hideLegend && <ChartsLegend_1.ChartsLegend {...legendProps}/>}
        <ChartsSurface_1.ChartsSurface {...chartsSurfaceProps}>
          <ChartsAxis_1.ChartsAxis {...chartsAxisProps}/>
          <ChartsGrid_1.ChartsGrid {...gridProps}/>
          <g data-drawing-container>
            {/* The `data-drawing-container` indicates that children are part of the drawing area. Ref: https://github.com/mui/mui-x/issues/13659 */}
            <ScatterPlot_1.ScatterPlot {...scatterPlotProps}/>
          </g>
          <ChartsOverlay_1.ChartsOverlay {...overlayProps}/>
          <ChartsAxisHighlight_1.ChartsAxisHighlight {...axisHighlightProps}/>
          {children}
        </ChartsSurface_1.ChartsSurface>
        {!props.loading && <Tooltip trigger="item" {...(_e = props.slotProps) === null || _e === void 0 ? void 0 : _e.tooltip}/>}
      </ChartsWrapper_1.ChartsWrapper>
    </ChartDataProvider_1.ChartDataProvider>);
});
exports.ScatterChart = ScatterChart;
ScatterChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.object,
    }),
    /**
     * The configuration of axes highlight.
     * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
     * @default { x: 'none', y: 'none' }
     */
    axisHighlight: prop_types_1.default.shape({
        x: prop_types_1.default.oneOf(['band', 'line', 'none']),
        y: prop_types_1.default.oneOf(['band', 'line', 'none']),
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
    /**
     * If true, the interaction will not use the Voronoi cell and fall back to hover events.
     * @default false
     */
    disableVoronoi: prop_types_1.default.bool,
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
     * The function called for onClick events.
     * The second argument contains information about all line/bar elements at the current mouse position.
     * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
     * @param {null | ChartsAxisData} data The data about the clicked axis and items associated with it.
     */
    onAxisClick: prop_types_1.default.func,
    /**
     * The callback fired when the highlighted item changes.
     *
     * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
     */
    onHighlightChange: prop_types_1.default.func,
    /**
     * Callback fired when clicking on a scatter item.
     * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element if using Voronoi cells. Or the Mouse event from the scatter element, when `disableVoronoi=true`.
     * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
     */
    onItemClick: prop_types_1.default.func,
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
    title: prop_types_1.default.string,
    /**
     * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
     * If `undefined`, the radius is assumed to be infinite.
     */
    voronoiMaxRadius: prop_types_1.default.number,
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            offset: prop_types_1.default.number,
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            offset: prop_types_1.default.number,
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            offset: prop_types_1.default.number,
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            offset: prop_types_1.default.number,
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
            min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
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
            valueFormatter: prop_types_1.default.func,
            width: prop_types_1.default.number,
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
};
