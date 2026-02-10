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
exports.MarkPlot = MarkPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var React = require("react");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var CircleMarkElement_1 = require("./CircleMarkElement");
var MarkElement_1 = require("./MarkElement");
var hooks_1 = require("../hooks");
var useInternalIsZoomInteracting_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var ChartProvider_1 = require("../context/ChartProvider");
var useMarkPlotData_1 = require("./useMarkPlotData");
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkPlot API](https://mui.com/x/api/charts/mark-plot/)
 */
function MarkPlot(props) {
    var slots = props.slots, slotProps = props.slotProps, inSkipAnimation = props.skipAnimation, onItemClick = props.onItemClick, other = __rest(props, ["slots", "slotProps", "skipAnimation", "onItemClick"]);
    var isZoomInteracting = (0, useInternalIsZoomInteracting_1.useInternalIsZoomInteracting)();
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(isZoomInteracting || inSkipAnimation);
    var xAxis = (0, hooks_1.useXAxes)().xAxis;
    var yAxis = (0, hooks_1.useYAxes)().yAxis;
    var store = (0, ChartProvider_1.useChartContext)().store;
    var _a = (0, hooks_1.useItemHighlightedGetter)(), isFaded = _a.isFaded, isHighlighted = _a.isHighlighted;
    var xAxisHighlightIndexes = store.use(useChartCartesianAxis_1.selectorChartsHighlightXAxisIndex);
    var highlightedItems = React.useMemo(function () {
        var rep = {};
        for (var _i = 0, xAxisHighlightIndexes_1 = xAxisHighlightIndexes; _i < xAxisHighlightIndexes_1.length; _i++) {
            var _a = xAxisHighlightIndexes_1[_i], dataIndex = _a.dataIndex, axisId = _a.axisId;
            if (rep[axisId] === undefined) {
                rep[axisId] = new Set([dataIndex]);
            }
            else {
                rep[axisId].add(dataIndex);
            }
        }
        return rep;
    }, [xAxisHighlightIndexes]);
    var completedData = (0, useMarkPlotData_1.useMarkPlotData)(xAxis, yAxis);
    return ((0, jsx_runtime_1.jsx)("g", __assign({}, other, { children: completedData.map(function (_a) {
            var _b;
            var seriesId = _a.seriesId, clipId = _a.clipId, shape = _a.shape, xAxisId = _a.xAxisId, marks = _a.marks, hidden = _a.hidden;
            var Mark = (_b = slots === null || slots === void 0 ? void 0 : slots.mark) !== null && _b !== void 0 ? _b : (shape === 'circle' ? CircleMarkElement_1.CircleMarkElement : MarkElement_1.MarkElement);
            var isSeriesHighlighted = isHighlighted({ seriesId: seriesId });
            var isSeriesFaded = !isSeriesHighlighted && isFaded({ seriesId: seriesId });
            return ((0, jsx_runtime_1.jsx)("g", { clipPath: "url(#".concat(clipId, ")"), "data-series": seriesId, children: marks.map(function (_a) {
                    var _b;
                    var x = _a.x, y = _a.y, index = _a.index, color = _a.color;
                    return ((0, jsx_runtime_1.jsx)(Mark, __assign({ seriesId: seriesId, dataIndex: index, shape: shape, color: color, x: x, y: y, skipAnimation: skipAnimation, onClick: onItemClick &&
                            (function (event) { return onItemClick(event, { type: 'line', seriesId: seriesId, dataIndex: index }); }), isHighlighted: ((_b = highlightedItems[xAxisId]) === null || _b === void 0 ? void 0 : _b.has(index)) || isSeriesHighlighted, isFaded: isSeriesFaded, hidden: hidden }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.mark), "".concat(seriesId, "-").concat(index)));
                }) }, seriesId));
        }) })));
}
MarkPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Callback fired when a line mark item is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * If `true`, animations are skipped.
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
};
