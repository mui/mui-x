"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunnelChart = void 0;
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
var useChartContainerProProps_1 = require("../ChartContainerPro/useChartContainerProProps");
var ChartDataProviderPro_1 = require("../ChartDataProviderPro");
var FunnelChart_plugins_1 = require("./FunnelChart.plugins");
var seriesConfig = { funnel: seriesConfig_1.seriesConfig };
var FunnelChart = React.forwardRef(function FunnelChart(props, ref) {
    var _a, _b, _c;
    var themedProps = (0, styles_1.useThemeProps)({ props: props, name: 'MuiFunnelChart' });
    var _d = (0, useFunnelChartProps_1.useFunnelChartProps)(themedProps), chartContainerProps = _d.chartContainerProps, funnelPlotProps = _d.funnelPlotProps, overlayProps = _d.overlayProps, legendProps = _d.legendProps, chartsAxisProps = _d.chartsAxisProps, chartsWrapperProps = _d.chartsWrapperProps, axisHighlightProps = _d.axisHighlightProps, children = _d.children;
    var _e = (0, useChartContainerProProps_1.useChartContainerProProps)(chartContainerProps, ref), chartDataProviderProProps = _e.chartDataProviderProProps, chartsSurfaceProps = _e.chartsSurfaceProps;
    var Tooltip = (_b = (_a = themedProps.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : ChartsTooltip_1.ChartsTooltip;
    return (<ChartDataProviderPro_1.ChartDataProviderPro {...chartDataProviderProProps} gap={themedProps.gap} seriesConfig={seriesConfig} plugins={FunnelChart_plugins_1.FUNNEL_CHART_PLUGINS}>
      <ChartsWrapper_1.ChartsWrapper {...chartsWrapperProps}>
        {!themedProps.hideLegend && <ChartsLegend_1.ChartsLegend {...legendProps}/>}
        <ChartsSurface_1.ChartsSurface {...chartsSurfaceProps}>
          <FunnelPlot_1.FunnelPlot {...funnelPlotProps}/>
          <ChartsOverlay_1.ChartsOverlay {...overlayProps}/>
          <ChartsAxisHighlight_1.ChartsAxisHighlight {...axisHighlightProps}/>
          <ChartsAxis_1.ChartsAxis {...chartsAxisProps}/>
          {children}
        </ChartsSurface_1.ChartsSurface>
        {!themedProps.loading && <Tooltip trigger="item" {...(_c = themedProps.slotProps) === null || _c === void 0 ? void 0 : _c.tooltip}/>}
      </ChartsWrapper_1.ChartsWrapper>
    </ChartDataProviderPro_1.ChartDataProviderPro>);
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
    desc: prop_types_1.default.string,
    /**
     * If `true`, the charts will not listen to the mouse move event.
     * It might break interactive features, but will improve performance.
     * @default false
     */
    disableAxisListener: prop_types_1.default.bool,
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
     * If `true`, the legend is not rendered.
     * @default false
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
     * The second argument contains information about all funnel elements at the current position.
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
     * Callback fired when a funnel item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
     */
    onItemClick: prop_types_1.default.func,
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
    title: prop_types_1.default.string,
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
};
