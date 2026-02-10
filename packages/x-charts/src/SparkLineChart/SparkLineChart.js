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
exports.SparkLineChart = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var ChartsClipPath_1 = require("../ChartsClipPath");
var BarChart_1 = require("../BarChart");
var LineChart_1 = require("../LineChart");
var ChartDataProvider_1 = require("../ChartDataProvider");
var ChartsSurface_1 = require("../ChartsSurface");
var constants_1 = require("../constants");
var ChartsTooltip_1 = require("../ChartsTooltip");
var ChartsAxisHighlight_1 = require("../ChartsAxisHighlight");
var FocusedLineMark_1 = require("../LineChart/FocusedLineMark");
var SPARK_LINE_DEFAULT_MARGIN = 5;
/**
 * Demos:
 *
 * - [SparkLine](https://mui.com/x/react-charts/sparkline/)
 *
 * API:
 *
 * - [SparkLineChart API](https://mui.com/x/api/charts/spark-line-chart/)
 */
var SparkLineChart = React.forwardRef(function SparkLineChart(props, ref) {
    var _a, _b, _c, _d;
    var xAxisProps = props.xAxis, yAxisProps = props.yAxis, width = props.width, height = props.height, _e = props.margin, margin = _e === void 0 ? SPARK_LINE_DEFAULT_MARGIN : _e, color = props.color, baseline = props.baseline, sx = props.sx, showTooltip = props.showTooltip, showHighlight = props.showHighlight, inAxisHighlight = props.axisHighlight, children = props.children, slots = props.slots, slotProps = props.slotProps, data = props.data, _f = props.plotType, plotType = _f === void 0 ? 'line' : _f, _g = props.valueFormatter, valueFormatter = _g === void 0 ? function (value) { return (value === null ? '' : value.toString()); } : _g, area = props.area, _h = props.curve, curve = _h === void 0 ? 'linear' : _h, className = props.className, disableClipping = props.disableClipping, clipAreaOffset = props.clipAreaOffset, onHighlightChange = props.onHighlightChange, onHighlightedAxisChange = props.onHighlightedAxisChange, highlightedAxis = props.highlightedAxis, highlightedItem = props.highlightedItem, other = __rest(props, ["xAxis", "yAxis", "width", "height", "margin", "color", "baseline", "sx", "showTooltip", "showHighlight", "axisHighlight", "children", "slots", "slotProps", "data", "plotType", "valueFormatter", "area", "curve", "className", "disableClipping", "clipAreaOffset", "onHighlightChange", "onHighlightedAxisChange", "highlightedAxis", "highlightedItem"]);
    var id = (0, useId_1.default)();
    var clipPathId = "".concat(id, "-clip-path");
    var clipPathOffset = React.useMemo(function () {
        var _a, _b, _c, _d;
        return ({
            top: (_a = clipAreaOffset === null || clipAreaOffset === void 0 ? void 0 : clipAreaOffset.top) !== null && _a !== void 0 ? _a : 1,
            right: (_b = clipAreaOffset === null || clipAreaOffset === void 0 ? void 0 : clipAreaOffset.right) !== null && _b !== void 0 ? _b : 1,
            bottom: (_c = clipAreaOffset === null || clipAreaOffset === void 0 ? void 0 : clipAreaOffset.bottom) !== null && _c !== void 0 ? _c : 1,
            left: (_d = clipAreaOffset === null || clipAreaOffset === void 0 ? void 0 : clipAreaOffset.left) !== null && _d !== void 0 ? _d : 1,
        });
    }, [clipAreaOffset === null || clipAreaOffset === void 0 ? void 0 : clipAreaOffset.bottom, clipAreaOffset === null || clipAreaOffset === void 0 ? void 0 : clipAreaOffset.left, clipAreaOffset === null || clipAreaOffset === void 0 ? void 0 : clipAreaOffset.right, clipAreaOffset === null || clipAreaOffset === void 0 ? void 0 : clipAreaOffset.top]);
    var defaultXHighlight = React.useMemo(function () { return (showHighlight && plotType === 'bar' ? { x: 'band' } : { x: 'none' }); }, [plotType, showHighlight]);
    var axisHighlight = React.useMemo(function () { return (__assign(__assign({}, defaultXHighlight), inAxisHighlight)); }, [defaultXHighlight, inAxisHighlight]);
    var Tooltip = (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.tooltip) !== null && _b !== void 0 ? _b : ChartsTooltip_1.ChartsTooltip;
    var colors = React.useMemo(function () {
        if (color == null) {
            return undefined;
        }
        return typeof color === 'function' ? function (mode) { return [color(mode)]; } : [color];
    }, [color]);
    var series = React.useMemo(function () { return [
        __assign({ type: plotType, data: data, valueFormatter: valueFormatter }, (plotType === 'bar' ? {} : { area: area, curve: curve, baseline: baseline, disableHighlight: !showHighlight })),
    ]; }, [area, baseline, curve, data, plotType, showHighlight, valueFormatter]);
    var xAxis = React.useMemo(function () {
        var _a;
        return [
            __assign(__assign({ id: constants_1.DEFAULT_X_AXIS_KEY, scaleType: plotType === 'bar' ? 'band' : 'point', hideTooltip: xAxisProps === undefined }, xAxisProps), { data: (_a = xAxisProps === null || xAxisProps === void 0 ? void 0 : xAxisProps.data) !== null && _a !== void 0 ? _a : Array.from({ length: data.length }, function (_, index) { return index; }), position: 'none' }),
        ];
    }, [data.length, plotType, xAxisProps]);
    var yAxis = React.useMemo(function () { return [
        __assign(__assign({ id: constants_1.DEFAULT_Y_AXIS_KEY }, yAxisProps), { position: 'none' }),
    ]; }, [yAxisProps]);
    return ((0, jsx_runtime_1.jsxs)(ChartDataProvider_1.ChartDataProvider, { series: series, width: width, height: height, margin: margin, xAxis: xAxis, yAxis: yAxis, colors: colors, disableAxisListener: onHighlightedAxisChange === undefined &&
            (!showTooltip || ((_c = slotProps === null || slotProps === void 0 ? void 0 : slotProps.tooltip) === null || _c === void 0 ? void 0 : _c.trigger) !== 'axis') &&
            (axisHighlight === null || axisHighlight === void 0 ? void 0 : axisHighlight.x) === 'none' &&
            (axisHighlight === null || axisHighlight === void 0 ? void 0 : axisHighlight.y) === 'none', onHighlightChange: onHighlightChange, onHighlightedAxisChange: onHighlightedAxisChange, highlightedAxis: highlightedAxis, highlightedItem: highlightedItem, children: [(0, jsx_runtime_1.jsxs)(ChartsSurface_1.ChartsSurface, __assign({ className: className, ref: ref, sx: sx }, other, { children: [(0, jsx_runtime_1.jsxs)("g", { clipPath: "url(#".concat(clipPathId, ")"), children: [plotType === 'bar' && (0, jsx_runtime_1.jsx)(BarChart_1.BarPlot, { skipAnimation: true, slots: slots, slotProps: slotProps }), plotType === 'line' && ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(LineChart_1.AreaPlot, { skipAnimation: true, slots: slots, slotProps: slotProps }), (0, jsx_runtime_1.jsx)(LineChart_1.LinePlot, { skipAnimation: true, slots: slots, slotProps: slotProps })] }))] }), plotType === 'line' && ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(LineChart_1.LineHighlightPlot, { slots: slots, slotProps: slotProps }), (0, jsx_runtime_1.jsx)(FocusedLineMark_1.FocusedLineMark, {})] })), disableClipping ? null : (0, jsx_runtime_1.jsx)(ChartsClipPath_1.ChartsClipPath, { id: clipPathId, offset: clipPathOffset }), (0, jsx_runtime_1.jsx)(ChartsAxisHighlight_1.ChartsAxisHighlight, __assign({}, axisHighlight)), children] })), showTooltip && (0, jsx_runtime_1.jsx)(Tooltip, __assign({}, (_d = props.slotProps) === null || _d === void 0 ? void 0 : _d.tooltip))] }));
});
exports.SparkLineChart = SparkLineChart;
SparkLineChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.object,
    }),
    /**
     * Set to `true` to fill spark line area.
     * Has no effect if plotType='bar'.
     * @default false
     */
    area: prop_types_1.default.bool,
    axisHighlight: prop_types_1.default.shape({
        x: prop_types_1.default.oneOf(['band', 'line', 'none']),
        y: prop_types_1.default.oneOf(['band', 'line', 'none']),
    }),
    /**
     * The value of the line at the base of the series area.
     *
     * - `'min'` the area will fill the space **under** the line.
     * - `'max'` the area will fill the space **above** the line.
     * - `number` the area will fill the space between this value and the line
     *
     * @default 0
     */
    baseline: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['max', 'min']), prop_types_1.default.number]),
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
     * The clipped area offset in pixels.
     *
     * This prevents partial clipping of lines when they are drawn on the edge of the drawing area.
     *
     * @default { top: 1, right: 1, bottom: 1, left: 1 }
     */
    clipAreaOffset: prop_types_1.default.shape({
        bottom: prop_types_1.default.number,
        left: prop_types_1.default.number,
        right: prop_types_1.default.number,
        top: prop_types_1.default.number,
    }),
    /**
     * Color used to colorize the sparkline.
     * @default rainbowSurgePalette[0]
     */
    color: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    /**
     * @default 'linear'
     */
    curve: prop_types_1.default.oneOf([
        'bumpX',
        'bumpY',
        'catmullRom',
        'linear',
        'monotoneX',
        'monotoneY',
        'natural',
        'step',
        'stepAfter',
        'stepBefore',
    ]),
    /**
     * Data to plot.
     */
    data: prop_types_1.default.arrayOf(prop_types_1.default.number).isRequired,
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
     * When `true`, the chart's drawing area will not be clipped and elements within can visually overflow the chart.
     *
     * @default false
     */
    disableClipping: prop_types_1.default.bool,
    /**
     * If true, the voronoi interaction are ignored.
     */
    disableVoronoi: prop_types_1.default.bool,
    enableKeyboardNavigation: prop_types_1.default.bool,
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
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['bar']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['line']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['scatter']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['pie']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['radar']).isRequired,
        }),
    ]).isRequired),
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
    initialHiddenItems: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['bar']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['line']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['scatter']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['pie']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string,
            type: prop_types_1.default.oneOf(['radar']).isRequired,
        }),
    ]).isRequired),
    /**
     * Localized text for chart components.
     */
    localeText: prop_types_1.default.object,
    /**
     * The margin between the SVG and the drawing area.
     * It's used for leaving some space for extra information such as the x- and y-axis or legend.
     *
     * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
     * @default 5
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
     * Callback fired when clicking close to an item.
     * This is only available for scatter plot for now.
     * @param {MouseEvent} event Mouse event caught at the svg level
     * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
     */
    onItemClick: prop_types_1.default.func,
    /**
     * The callback fired when the tooltip item changes.
     *
     * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
     */
    onTooltipItemChange: prop_types_1.default.func,
    /**
     * Type of plot used.
     * @default 'line'
     */
    plotType: prop_types_1.default.oneOf(['bar', 'line']),
    /**
     * Set to `true` to highlight the value.
     * With line, it shows a point.
     * With bar, it shows a highlight band.
     * @default false
     */
    showHighlight: prop_types_1.default.bool,
    /**
     * Set to `true` to enable the tooltip in the sparkline.
     * @default false
     */
    showTooltip: prop_types_1.default.bool,
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
    tooltipItem: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number.isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['bar']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['line']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number.isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['scatter']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number.isRequired,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['pie']).isRequired,
        }),
        prop_types_1.default.shape({
            dataIndex: prop_types_1.default.number,
            seriesId: prop_types_1.default.string.isRequired,
            type: prop_types_1.default.oneOf(['radar']).isRequired,
        }),
    ]),
    /**
     * Formatter used by the tooltip.
     * @param {number} value The value to format.
     * @returns {string} the formatted value.
     * @default (value: number | null) => (value === null ? '' : value.toString())
     */
    valueFormatter: prop_types_1.default.func,
    /**
     * Defines the maximum distance between a scatter point and the pointer that triggers the interaction.
     * If set to `'item'`, the radius is the `markerSize`.
     * If `undefined`, the radius is assumed to be infinite.
     */
    voronoiMaxRadius: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['item']), prop_types_1.default.number]),
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width: prop_types_1.default.number,
    /**
     * The xAxis configuration.
     * Notice it is a single [[AxisConfig]] object, not an array of configuration.
     */
    xAxis: prop_types_1.default.oneOfType([
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
    ]),
    /**
     * The yAxis configuration.
     * Notice it is a single [[AxisConfig]] object, not an array of configuration.
     */
    yAxis: prop_types_1.default.oneOfType([
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
    ]),
};
