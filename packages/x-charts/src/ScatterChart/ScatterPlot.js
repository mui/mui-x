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
exports.ScatterPlot = ScatterPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var Scatter_1 = require("./Scatter");
var useScatterSeries_1 = require("../hooks/useScatterSeries");
var hooks_1 = require("../hooks");
var useZAxis_1 = require("../hooks/useZAxis");
var seriesConfig_1 = require("./seriesConfig");
var BatchScatter_1 = require("./BatchScatter");
/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [ScatterPlot API](https://mui.com/x/api/charts/scatter-plot/)
 */
function ScatterPlot(props) {
    var _a;
    var slots = props.slots, slotProps = props.slotProps, onItemClick = props.onItemClick, renderer = props.renderer;
    var seriesData = (0, useScatterSeries_1.useScatterSeriesContext)();
    var _b = (0, hooks_1.useXAxes)(), xAxis = _b.xAxis, xAxisIds = _b.xAxisIds;
    var _c = (0, hooks_1.useYAxes)(), yAxis = _c.yAxis, yAxisIds = _c.yAxisIds;
    var _d = (0, useZAxis_1.useZAxes)(), zAxis = _d.zAxis, zAxisIds = _d.zAxisIds;
    if (seriesData === undefined) {
        return null;
    }
    var series = seriesData.series, seriesOrder = seriesData.seriesOrder;
    var defaultXAxisId = xAxisIds[0];
    var defaultYAxisId = yAxisIds[0];
    var defaultZAxisId = zAxisIds[0];
    var DefaultScatterItems = renderer === 'svg-batch' ? BatchScatter_1.BatchScatter : Scatter_1.Scatter;
    var ScatterItems = (_a = slots === null || slots === void 0 ? void 0 : slots.scatter) !== null && _a !== void 0 ? _a : DefaultScatterItems;
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: seriesOrder.map(function (seriesId) {
            var _a = series[seriesId], id = _a.id, xAxisId = _a.xAxisId, yAxisId = _a.yAxisId, zAxisId = _a.zAxisId, color = _a.color, hidden = _a.hidden;
            if (hidden) {
                return null;
            }
            var colorGetter = seriesConfig_1.scatterSeriesConfig.colorProcessor(series[seriesId], xAxis[xAxisId !== null && xAxisId !== void 0 ? xAxisId : defaultXAxisId], yAxis[yAxisId !== null && yAxisId !== void 0 ? yAxisId : defaultYAxisId], zAxis[zAxisId !== null && zAxisId !== void 0 ? zAxisId : defaultZAxisId]);
            var xScale = xAxis[xAxisId !== null && xAxisId !== void 0 ? xAxisId : defaultXAxisId].scale;
            var yScale = yAxis[yAxisId !== null && yAxisId !== void 0 ? yAxisId : defaultYAxisId].scale;
            return ((0, jsx_runtime_1.jsx)(ScatterItems, __assign({ xScale: xScale, yScale: yScale, color: color, colorGetter: colorGetter, series: series[seriesId], onItemClick: onItemClick, slots: slots, slotProps: slotProps }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.scatter), id));
        }) }));
}
ScatterPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Callback fired when clicking on a scatter item.
     * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
     * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
     */
    onItemClick: prop_types_1.default.func,
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
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
};
