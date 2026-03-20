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
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var ChartsAxis_1 = require("@mui/x-charts/ChartsAxis");
var ChartsWrapper_1 = require("@mui/x-charts/ChartsWrapper");
var ChartsClipPath_1 = require("@mui/x-charts/ChartsClipPath");
var ChartsOverlay_1 = require("@mui/x-charts/ChartsOverlay");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
var ChartsBrushOverlay_1 = require("@mui/x-charts/ChartsBrushOverlay");
var ChartsLayerContainer_1 = require("@mui/x-charts/ChartsLayerContainer");
var HeatmapPlot_1 = require("./HeatmapPlot");
var HeatmapTooltip_1 = require("./HeatmapTooltip");
var ChartsDataProviderPro_1 = require("../ChartsDataProviderPro");
var ChartsToolbarPro_1 = require("../ChartsToolbarPro");
var FocusedHeatmapCell_1 = require("./FocusedHeatmapCell");
var useHeatmapProps_1 = require("./useHeatmapProps");
var ChartsSvgLayer_1 = require("../ChartsSvgLayer");
var Heatmap = React.forwardRef(function Heatmap(inProps, ref) {
    var _a, _b, _c;
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiHeatmap' });
    var sx = props.sx, slots = props.slots, slotProps = props.slotProps, loading = props.loading, hideLegend = props.hideLegend, _d = props.showToolbar, showToolbar = _d === void 0 ? false : _d;
    var _e = (0, useHeatmapProps_1.useHeatmapProps)(props), chartsDataProviderProProps = _e.chartsDataProviderProProps, chartsWrapperProps = _e.chartsWrapperProps, chartsAxisProps = _e.chartsAxisProps, clipPathProps = _e.clipPathProps, clipPathGroupProps = _e.clipPathGroupProps, legendProps = _e.legendProps, heatmapPlotProps = _e.heatmapPlotProps, overlayProps = _e.overlayProps, children = _e.children;
    var Tooltip = (_a = slots === null || slots === void 0 ? void 0 : slots.tooltip) !== null && _a !== void 0 ? _a : HeatmapTooltip_1.HeatmapTooltip;
    var Toolbar = (_b = slots === null || slots === void 0 ? void 0 : slots.toolbar) !== null && _b !== void 0 ? _b : ChartsToolbarPro_1.ChartsToolbarPro;
    return ((0, jsx_runtime_1.jsx)(ChartsDataProviderPro_1.ChartsDataProviderPro, __assign({}, chartsDataProviderProProps, { children: (0, jsx_runtime_1.jsxs)(ChartsWrapper_1.ChartsWrapper, __assign({}, chartsWrapperProps, { ref: ref, children: [showToolbar ? (0, jsx_runtime_1.jsx)(Toolbar, __assign({}, (_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.toolbar)) : null, !hideLegend && (0, jsx_runtime_1.jsx)(ChartsLegend_1.ChartsLegend, __assign({}, legendProps)), (0, jsx_runtime_1.jsx)(ChartsLayerContainer_1.ChartsLayerContainer, { children: (0, jsx_runtime_1.jsxs)(ChartsSvgLayer_1.ChartsSvgLayer, { sx: sx, children: [(0, jsx_runtime_1.jsxs)("g", __assign({}, clipPathGroupProps, { children: [(0, jsx_runtime_1.jsx)(HeatmapPlot_1.HeatmapPlot, __assign({}, heatmapPlotProps)), (0, jsx_runtime_1.jsx)(FocusedHeatmapCell_1.FocusedHeatmapCell, {}), (0, jsx_runtime_1.jsx)(ChartsOverlay_1.ChartsOverlay, __assign({}, overlayProps))] })), (0, jsx_runtime_1.jsx)(ChartsAxis_1.ChartsAxis, __assign({}, chartsAxisProps)), (0, jsx_runtime_1.jsx)(ChartsClipPath_1.ChartsClipPath, __assign({}, clipPathProps)), (0, jsx_runtime_1.jsx)(ChartsBrushOverlay_1.ChartsBrushOverlay, {}), children] }) }), !loading && (0, jsx_runtime_1.jsx)(Tooltip, __assign({}, slotProps === null || slotProps === void 0 ? void 0 : slotProps.tooltip))] })) })));
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
            setAxisZoomData: prop_types_1.default.func.isRequired,
            setZoomData: prop_types_1.default.func.isRequired,
        }),
    }),
    /**
     * The border radius of the heatmap cells in pixels.
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
     * If `true`, disables keyboard navigation for the chart.
     */
    disableKeyboardNavigation: prop_types_1.default.bool,
    /**
     * Options to enable features planned for the next major.
     */
    experimentalFeatures: prop_types_1.default.object,
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
    highlightedItem: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['heatmap']).isRequired,
            xIndex: prop_types_1.default.number.isRequired,
            yIndex: prop_types_1.default.number.isRequired,
        }),
        prop_types_1.default.shape({
            seriesId: prop_types_1.default.string.isRequired,
            xIndex: prop_types_1.default.number.isRequired,
            yIndex: prop_types_1.default.number.isRequired,
        }),
    ]),
    /**
     * This prop is used to help implement the accessibility logic.
     * If you don't provide this prop. It falls back to a randomly generated id.
     */
    id: prop_types_1.default.string,
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
     * The callback fired when the highlighted item changes.
     *
     * @param {HighlightItemIdentifierWithType<SeriesType> | null} highlightedItem  The newly highlighted item.
     */
    onHighlightChange: prop_types_1.default.func,
    /**
     * The callback fired when an item is clicked.
     *
     * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The click event.
     * @param {SeriesItemIdentifierWithType<SeriesType>} item The clicked item.
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
     * The series to display in the bar chart.
     * An array of [[HeatmapSeries]] objects.
     */
    series: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
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
    /**
     * The title of the chart.
     * Used to provide an accessible label for the chart.
     */
    title: prop_types_1.default.string,
    /**
     * The configuration of the tooltip.
     * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
     */
    tooltip: prop_types_1.default.object,
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
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['heatmap']).isRequired,
            xIndex: prop_types_1.default.number.isRequired,
            yIndex: prop_types_1.default.number.isRequired,
        }),
        prop_types_1.default.shape({
            seriesId: prop_types_1.default.string.isRequired,
            xIndex: prop_types_1.default.number.isRequired,
            yIndex: prop_types_1.default.number.isRequired,
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
