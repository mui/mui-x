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
exports.ChartsContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var ChartDataProvider_1 = require("../ChartDataProvider");
var useChartsContainerProps_1 = require("./useChartsContainerProps");
var ChartsSurface_1 = require("../ChartsSurface");
/**
 * It sets up the data providers as well as the `<svg>` for the chart.
 *
 * This is a combination of both the `ChartDataProvider` and `ChartsSurface` components.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 *
 * API:
 *
 * - [ChartsContainer API](https://mui.com/x/api/charts/charts-container/)
 *
 * @example
 * ```jsx
 * <ChartsContainer
 *   series={[{ label: "Label", type: "bar", data: [10, 20] }]}
 *   xAxis={[{ data: ["A", "B"], scaleType: "band", id: "x-axis" }]}
 * >
 *    <BarPlot />
 *    <ChartsXAxis axisId="x-axis" />
 * </ChartsContainer>
 * ```
 */
var ChartsContainer = React.forwardRef(function ChartsContainer(props, ref) {
    var _a = (0, useChartsContainerProps_1.useChartsContainerProps)(props, ref), chartDataProviderProps = _a.chartDataProviderProps, children = _a.children, chartsSurfaceProps = _a.chartsSurfaceProps;
    return ((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, __assign({}, chartDataProviderProps, { children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, __assign({}, chartsSurfaceProps, { children: children })) })));
});
exports.ChartsContainer = ChartsContainer;
// @ts-ignore
ChartsContainer.propTypes = {
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
    /**
     * If true, the voronoi interaction are ignored.
     */
    disableVoronoi: prop_types_1.default.bool,
    enableKeyboardNavigation: prop_types_1.default.bool,
    /**
     * Options to enable features planned for the next major.
     */
    experimentalFeatures: prop_types_1.default.shape({
        preferStrictDomainInLineCharts: prop_types_1.default.bool,
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
        type: prop_types_1.default.object.isRequired,
    })),
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
        type: prop_types_1.default.object.isRequired,
    })),
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
     * The configuration of the radial-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    radiusAxis: prop_types_1.default.arrayOf(prop_types_1.default.shape({
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
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
        ignoreTooltip: prop_types_1.default.bool,
        label: prop_types_1.default.string,
        labelStyle: prop_types_1.default.object,
        max: prop_types_1.default.number,
        maxRadius: prop_types_1.default.number,
        min: prop_types_1.default.number,
        minRadius: prop_types_1.default.number,
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
        tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
        tickLabelStyle: prop_types_1.default.object,
        tickMaxStep: prop_types_1.default.number,
        tickMinStep: prop_types_1.default.number,
        tickNumber: prop_types_1.default.number,
        tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
        tickSize: prop_types_1.default.number,
        tickSpacing: prop_types_1.default.number,
        valueFormatter: prop_types_1.default.func,
    })),
    /**
     * The configuration of the rotation-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    rotationAxis: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            groups: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                getValue: prop_types_1.default.func.isRequired,
                tickLabelStyle: prop_types_1.default.object,
                tickSize: prop_types_1.default.number,
            })),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
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
            startAngle: prop_types_1.default.number,
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
        }),
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            groups: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                getValue: prop_types_1.default.func.isRequired,
                tickLabelStyle: prop_types_1.default.object,
                tickSize: prop_types_1.default.number,
            })),
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
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
            startAngle: prop_types_1.default.number,
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
        }),
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['log']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            startAngle: prop_types_1.default.number,
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
        }),
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['symlog']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            startAngle: prop_types_1.default.number,
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
        }),
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['pow']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            startAngle: prop_types_1.default.number,
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
        }),
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['sqrt']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            startAngle: prop_types_1.default.number,
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
        }),
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
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
            startAngle: prop_types_1.default.number,
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
        }),
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
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
            startAngle: prop_types_1.default.number,
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
        }),
        prop_types_1.default.shape({
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
            endAngle: prop_types_1.default.number,
            height: prop_types_1.default.number,
            hideTooltip: prop_types_1.default.bool,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
            ignoreTooltip: prop_types_1.default.bool,
            label: prop_types_1.default.string,
            labelGap: prop_types_1.default.number,
            labelStyle: prop_types_1.default.object,
            max: prop_types_1.default.number,
            min: prop_types_1.default.number,
            offset: prop_types_1.default.number,
            position: prop_types_1.default.oneOf(['bottom', 'none', 'top']),
            reverse: prop_types_1.default.bool,
            scaleType: prop_types_1.default.oneOf(['linear']),
            slotProps: prop_types_1.default.object,
            slots: prop_types_1.default.object,
            startAngle: prop_types_1.default.number,
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
        }),
    ]).isRequired),
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
    /**
     * The props for the slots.
     */
    slotProps: prop_types_1.default.object,
    /**
     * Slots to customize charts' components.
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
        dataIndex: prop_types_1.default.number,
        seriesId: prop_types_1.default.string.isRequired,
        type: prop_types_1.default.oneOf(['bar', 'line', 'pie', 'radar', 'scatter']).isRequired,
    }),
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
