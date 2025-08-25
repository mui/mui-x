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
exports.Heatmap = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var useId_1 = require("@mui/utils/useId");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var ChartsAxis_1 = require("@mui/x-charts/ChartsAxis");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var ChartsWrapper_1 = require("@mui/x-charts/ChartsWrapper");
var ChartsClipPath_1 = require("@mui/x-charts/ChartsClipPath");
var ChartsOverlay_1 = require("@mui/x-charts/ChartsOverlay");
var constants_1 = require("@mui/x-charts/constants");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var HeatmapPlot_1 = require("./HeatmapPlot");
var seriesConfig_1 = require("./seriesConfig");
var HeatmapTooltip_1 = require("./HeatmapTooltip");
var Heatmap_plugins_1 = require("./Heatmap.plugins");
var ChartDataProviderPro_1 = require("../ChartDataProviderPro");
var ChartsToolbarPro_1 = require("../ChartsToolbarPro");
// The GnBu: https://github.com/d3/d3-scale-chromatic/blob/main/src/sequential-multi/GnBu.js
var defaultColorMap = (0, d3_interpolate_1.interpolateRgbBasis)([
    '#f7fcf0',
    '#e0f3db',
    '#ccebc5',
    '#a8ddb5',
    '#7bccc4',
    '#4eb3d3',
    '#2b8cbe',
    '#0868ac',
    '#084081',
]);
var seriesConfig = { heatmap: seriesConfig_1.seriesConfig };
function getDefaultDataForAxis(series, dimension) {
    var _a;
    if (((_a = series === null || series === void 0 ? void 0 : series[0]) === null || _a === void 0 ? void 0 : _a.data) === undefined || series[0].data.length === 0) {
        return [];
    }
    return Array.from({ length: Math.max.apply(Math, series[0].data.map(function (dataPoint) { return dataPoint[dimension]; })) + 1 }, function (_, index) { return index; });
}
var getDefaultDataForXAxis = function (series) { return getDefaultDataForAxis(series, 0); };
var getDefaultDataForYAxis = function (series) { return getDefaultDataForAxis(series, 1); };
var Heatmap = React.forwardRef(function Heatmap(inProps, ref) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiHeatmap' });
    var apiRef = props.apiRef, xAxis = props.xAxis, yAxis = props.yAxis, zAxis = props.zAxis, series = props.series, width = props.width, height = props.height, margin = props.margin, colors = props.colors, dataset = props.dataset, sx = props.sx, onAxisClick = props.onAxisClick, children = props.children, slots = props.slots, slotProps = props.slotProps, loading = props.loading, highlightedItem = props.highlightedItem, onHighlightChange = props.onHighlightChange, _k = props.hideLegend, hideLegend = _k === void 0 ? true : _k, _l = props.showToolbar, showToolbar = _l === void 0 ? false : _l;
    var id = (0, useId_1.default)();
    var clipPathId = "".concat(id, "-clip-path");
    var xAxisWithDefault = React.useMemo(function () {
        return (xAxis && xAxis.length > 0 ? xAxis : [{ id: constants_1.DEFAULT_X_AXIS_KEY }]).map(function (axis) {
            var _a;
            return (__assign(__assign({ scaleType: 'band', categoryGapRatio: 0 }, axis), { data: (_a = axis.data) !== null && _a !== void 0 ? _a : getDefaultDataForXAxis(series) }));
        });
    }, [series, xAxis]);
    var yAxisWithDefault = React.useMemo(function () {
        return (yAxis && yAxis.length > 0 ? yAxis : [{ id: constants_1.DEFAULT_Y_AXIS_KEY }]).map(function (axis) {
            var _a;
            return (__assign(__assign({ scaleType: 'band', categoryGapRatio: 0 }, axis), { data: (_a = axis.data) !== null && _a !== void 0 ? _a : getDefaultDataForYAxis(series) }));
        });
    }, [series, yAxis]);
    var zAxisWithDefault = React.useMemo(function () {
        return zAxis !== null && zAxis !== void 0 ? zAxis : [
            {
                colorMap: {
                    type: 'continuous',
                    min: 0,
                    max: 100,
                    color: defaultColorMap,
                },
            },
        ];
    }, [zAxis]);
    var chartsWrapperProps = {
        sx: sx,
        legendPosition: (_b = (_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.legend) === null || _b === void 0 ? void 0 : _b.position,
        legendDirection: (_d = (_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.legend) === null || _d === void 0 ? void 0 : _d.direction,
    };
    var Tooltip = (_e = slots === null || slots === void 0 ? void 0 : slots.tooltip) !== null && _e !== void 0 ? _e : HeatmapTooltip_1.HeatmapTooltip;
    var Toolbar = (_f = slots === null || slots === void 0 ? void 0 : slots.toolbar) !== null && _f !== void 0 ? _f : ChartsToolbarPro_1.ChartsToolbarPro;
    return (<ChartDataProviderPro_1.ChartDataProviderPro apiRef={apiRef} seriesConfig={seriesConfig} series={series.map(function (s) { return (__assign({ type: 'heatmap' }, s)); })} width={width} height={height} margin={margin} xAxis={xAxisWithDefault} yAxis={yAxisWithDefault} zAxis={zAxisWithDefault} colors={colors} dataset={dataset} disableAxisListener highlightedItem={highlightedItem} onHighlightChange={onHighlightChange} onAxisClick={onAxisClick} plugins={Heatmap_plugins_1.HEATMAP_PLUGINS}>
      <ChartsWrapper_1.ChartsWrapper {...chartsWrapperProps}>
        {showToolbar ? <Toolbar {...(_g = props.slotProps) === null || _g === void 0 ? void 0 : _g.toolbar}/> : null}
        {!hideLegend && (<ChartsLegend_1.ChartsLegend slots={__assign(__assign({}, slots), { legend: (_h = slots === null || slots === void 0 ? void 0 : slots.legend) !== null && _h !== void 0 ? _h : ChartsLegend_1.ContinuousColorLegend })} slotProps={{ legend: __assign({ labelPosition: 'extremes' }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.legend) }} sx={((_j = slotProps === null || slotProps === void 0 ? void 0 : slotProps.legend) === null || _j === void 0 ? void 0 : _j.direction) === 'vertical' ? { height: 150 } : { width: '50%' }}/>)}
        <ChartsSurface_1.ChartsSurface ref={ref} sx={sx}>
          <g clipPath={"url(#".concat(clipPathId, ")")}>
            <HeatmapPlot_1.HeatmapPlot slots={slots} slotProps={slotProps}/>
            <ChartsOverlay_1.ChartsOverlay loading={loading} slots={slots} slotProps={slotProps}/>
          </g>
          <ChartsAxis_1.ChartsAxis slots={slots} slotProps={slotProps}/>
          <ChartsClipPath_1.ChartsClipPath id={clipPathId}/>
          {children}
        </ChartsSurface_1.ChartsSurface>
        {!loading && <Tooltip {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.tooltip}/>}
      </ChartsWrapper_1.ChartsWrapper>
    </ChartDataProviderPro_1.ChartDataProviderPro>);
});
exports.Heatmap = Heatmap;
Heatmap.propTypes = {
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
     * If `true`, the legend is not rendered.
     * @default true
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
     * The series to display in the bar chart.
     * An array of [[HeatmapSeries]] objects.
     */
    series: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
    /**
     * The configuration helpers used to compute attributes according to the series type.
     * @ignore Unstable props for internal usage.
     */
    seriesConfig: prop_types_1.default.object,
    /**
     * If true, shows the default chart toolbar.
     * @default false
     */
    showToolbar: prop_types_1.default.bool,
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
     * The configuration of the tooltip.
     * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
     */
    tooltip: prop_types_1.default.object,
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
    })).isRequired,
    /**
     * The configuration of the y-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    yAxis: prop_types_1.default.arrayOf(prop_types_1.default.shape({
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
    })).isRequired,
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
