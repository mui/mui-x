"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarChart = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var ChartsLegend_1 = require("../ChartsLegend");
var ChartsOverlay_1 = require("../ChartsOverlay/ChartsOverlay");
var useRadarChartProps_1 = require("./useRadarChartProps");
var ChartsSurface_1 = require("../ChartsSurface");
var ChartsWrapper_1 = require("../ChartsWrapper");
var RadarGrid_1 = require("./RadarGrid");
var RadarDataProvider_1 = require("./RadarDataProvider/RadarDataProvider");
var RadarSeriesPlot_1 = require("./RadarSeriesPlot");
var RadarAxisHighlight_1 = require("./RadarAxisHighlight");
var RadarMetricLabels_1 = require("./RadarMetricLabels");
var ChartsTooltip_1 = require("../ChartsTooltip");
/**
 * Demos:
 *
 * - [Radar Chart](https://mui.com/x/react-charts/radar/)
 *
 * API:
 *
 * - [RadarChart API](https://mui.com/x/api/charts/radar-chart/)
 */
var RadarChart = React.forwardRef(function RadarChart(inProps, ref) {
    var _a, _b, _c, _d, _e;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiRadarChart' });
    var _f = (0, useRadarChartProps_1.useRadarChartProps)(props), chartsWrapperProps = _f.chartsWrapperProps, chartsSurfaceProps = _f.chartsSurfaceProps, radarDataProviderProps = _f.radarDataProviderProps, radarGrid = _f.radarGrid, radarSeriesAreaProps = _f.radarSeriesAreaProps, radarSeriesMarksProps = _f.radarSeriesMarksProps, overlayProps = _f.overlayProps, legendProps = _f.legendProps, highlight = _f.highlight, children = _f.children;
    var Tooltip = (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : ChartsTooltip_1.ChartsTooltip;
    var Toolbar = (_c = props.slots) === null || _c === void 0 ? void 0 : _c.toolbar;
    return (<RadarDataProvider_1.RadarDataProvider {...radarDataProviderProps}>
      <ChartsWrapper_1.ChartsWrapper {...chartsWrapperProps}>
        {props.showToolbar && Toolbar ? <Toolbar {...(_d = props.slotProps) === null || _d === void 0 ? void 0 : _d.toolbar}/> : null}
        {!props.hideLegend && <ChartsLegend_1.ChartsLegend {...legendProps}/>}
        <ChartsSurface_1.ChartsSurface {...chartsSurfaceProps} ref={ref}>
          <RadarGrid_1.RadarGrid {...radarGrid}/>
          <RadarMetricLabels_1.RadarMetricLabels />
          <RadarSeriesPlot_1.RadarSeriesArea {...radarSeriesAreaProps}/>
          {highlight === 'axis' && <RadarAxisHighlight_1.RadarAxisHighlight />}
          <RadarSeriesPlot_1.RadarSeriesMarks {...radarSeriesMarksProps}/>
          <ChartsOverlay_1.ChartsOverlay {...overlayProps}/>
          {children}
        </ChartsSurface_1.ChartsSurface>
        {!props.loading && <Tooltip {...(_e = props.slotProps) === null || _e === void 0 ? void 0 : _e.tooltip}/>}
      </ChartsWrapper_1.ChartsWrapper>
    </RadarDataProvider_1.RadarDataProvider>);
});
exports.RadarChart = RadarChart;
RadarChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.object,
    }),
    className: prop_types_1.default.string,
    /**
     * Color palette used to colorize multiple series.
     * @default rainbowSurgePalette
     */
    colors: prop_types_1.default.oneOfType([prop_types_1.default.arrayOf(prop_types_1.default.string), prop_types_1.default.func]),
    desc: prop_types_1.default.string,
    /**
     * If `true`, the charts will not listen to the mouse move event.
     * It might break interactive features, but will improve performance.
     * @default false
     */
    disableAxisListener: prop_types_1.default.bool,
    /**
     * The number of divisions in the radar grid.
     * @default 5
     */
    divisions: prop_types_1.default.number,
    /**
     * The height of the chart in px. If not defined, it takes the height of the parent element.
     */
    height: prop_types_1.default.number,
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
     * The callback fired when the highlighted item changes.
     *
     * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
     */
    onHighlightChange: prop_types_1.default.func,
    /**
     * Callback fired when a mark is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {RadarItemIdentifier} radarItemIdentifier The radar item identifier.
     */
    onMarkClick: prop_types_1.default.func,
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
    title: prop_types_1.default.string,
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
