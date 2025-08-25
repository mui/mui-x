"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartContainerPro = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var useChartContainerProProps_1 = require("./useChartContainerProProps");
var ChartDataProviderPro_1 = require("../ChartDataProviderPro");
/**
 * It sets up the data providers as well as the `<svg>` for the chart.
 *
 * This is a combination of both the `ChartDataProviderPro` and `ChartsSurface` components.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartContainer API](https://mui.com/x/api/charts/chart-container/)
 *
 * @example
 * ```jsx
 * <ChartContainerPro
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *    <BarPlot />
 *    <ChartsXAxis axisId="x-axis" />
 * </ChartContainerPro>
 * ```
 */
var ChartContainerPro = React.forwardRef(function ChartContainerProInner(props, ref) {
    var _a = (0, useChartContainerProProps_1.useChartContainerProProps)(props, ref), chartDataProviderProProps = _a.chartDataProviderProProps, children = _a.children, chartsSurfaceProps = _a.chartsSurfaceProps;
    return (<ChartDataProviderPro_1.ChartDataProviderPro {...chartDataProviderProProps}>
      <ChartsSurface_1.ChartsSurface {...chartsSurfaceProps}>{children}</ChartsSurface_1.ChartsSurface>
    </ChartDataProviderPro_1.ChartDataProviderPro>);
});
exports.ChartContainerPro = ChartContainerPro;
// @ts-expect-error the type coercion breaks the prop types
ChartContainerPro.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.shape({
            setZoomData: prop_types_1.default.func.isRequired,
        }),
    }),
    children: prop_types_1.default.node,
    className: prop_types_1.default.string,
    /**
     * Color palette used to colorize multiple series.
     * @default blueberryTwilightPalette
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
     * The height of the chart in px. If not defined, it takes the height of the parent element.
     */
    height: prop_types_1.default.number,
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
     * The list of zoom data related to each axis.
     */
    initialZoom: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        end: prop_types_1.default.number.isRequired,
        start: prop_types_1.default.number.isRequired,
    })),
    /**
     * The margin between the SVG and the drawing area.
     * It's used for leaving some space for extra information such as the x- and y-axis or legend.
     * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
     */
    margin: prop_types_1.default.shape({
        bottom: prop_types_1.default.number,
        left: prop_types_1.default.number,
        right: prop_types_1.default.number,
        top: prop_types_1.default.number,
    }),
    /**
     * The callback fired when the highlighted item changes.
     *
     * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
     */
    onHighlightChange: prop_types_1.default.func,
    /**
     * Callback fired when the zoom has changed.
     *
     * @param {ZoomData[]} zoomData Updated zoom data.
     */
    onZoomChange: prop_types_1.default.func,
    /**
     * The array of series to display.
     * Each type of series has its own specificity.
     * Please refer to the appropriate docs page to learn more about it.
     */
    series: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * If `true`, animations are skipped.
     * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
     */
    skipAnimation: prop_types_1.default.bool,
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
    /**
     * The configuration of the x-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    xAxis: prop_types_1.default.arrayOf(prop_types_1.default.shape({
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
        fill: prop_types_1.default.string,
        hideTooltip: prop_types_1.default.bool,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
        label: prop_types_1.default.string,
        labelStyle: prop_types_1.default.object,
        max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
        min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
        position: prop_types_1.default.oneOf(['bottom', 'top']),
        reverse: prop_types_1.default.bool,
        scaleType: prop_types_1.default.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
        slotProps: prop_types_1.default.object,
        slots: prop_types_1.default.object,
        stroke: prop_types_1.default.string,
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
        zoom: prop_types_1.default.oneOfType([
            prop_types_1.default.shape({
                filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                maxEnd: prop_types_1.default.number,
                maxSpan: prop_types_1.default.number,
                minSpan: prop_types_1.default.number,
                minStart: prop_types_1.default.number,
                panning: prop_types_1.default.bool,
                step: prop_types_1.default.number,
            }),
            prop_types_1.default.bool,
        ]),
    })),
    /**
     * The configuration of the y-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    yAxis: prop_types_1.default.arrayOf(prop_types_1.default.shape({
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
        fill: prop_types_1.default.string,
        hideTooltip: prop_types_1.default.bool,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
        label: prop_types_1.default.string,
        labelStyle: prop_types_1.default.object,
        max: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
        min: prop_types_1.default.oneOfType([prop_types_1.default.instanceOf(Date), prop_types_1.default.number]),
        position: prop_types_1.default.oneOf(['left', 'right']),
        reverse: prop_types_1.default.bool,
        scaleType: prop_types_1.default.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
        slotProps: prop_types_1.default.object,
        slots: prop_types_1.default.object,
        stroke: prop_types_1.default.string,
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
        zoom: prop_types_1.default.oneOfType([
            prop_types_1.default.shape({
                filterMode: prop_types_1.default.oneOf(['discard', 'keep']),
                maxEnd: prop_types_1.default.number,
                maxSpan: prop_types_1.default.number,
                minSpan: prop_types_1.default.number,
                minStart: prop_types_1.default.number,
                panning: prop_types_1.default.bool,
                step: prop_types_1.default.number,
            }),
            prop_types_1.default.bool,
        ]),
    })),
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
