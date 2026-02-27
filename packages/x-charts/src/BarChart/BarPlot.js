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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarPlot = BarPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var barElementClasses_1 = require("./barElementClasses");
var hooks_1 = require("../hooks");
var BarLabelPlot_1 = require("./BarLabel/BarLabelPlot");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var useInternalIsZoomInteracting_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting");
var useBarPlotData_1 = require("./useBarPlotData");
var barClasses_1 = require("./barClasses");
var animation_1 = require("../internals/animation/animation");
var IndividualBarPlot_1 = require("./IndividualBarPlot");
var BatchBarPlot_1 = require("./BatchBarPlot");
var BarPlotRoot = (0, styles_1.styled)('g', {
    name: 'MuiBarPlot',
    slot: 'Root',
})((_a = {},
    _a["& .".concat(barElementClasses_1.barElementClasses.root)] = {
        transitionProperty: 'opacity, fill',
        transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
        transitionTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION,
    },
    _a));
/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarPlot API](https://mui.com/x/api/charts/bar-plot/)
 */
function BarPlot(props) {
    var inSkipAnimation = props.skipAnimation, onItemClick = props.onItemClick, borderRadius = props.borderRadius, barLabel = props.barLabel, renderer = props.renderer, other = __rest(props, ["skipAnimation", "onItemClick", "borderRadius", "barLabel", "renderer"]);
    var isZoomInteracting = (0, useInternalIsZoomInteracting_1.useInternalIsZoomInteracting)();
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(isZoomInteracting || inSkipAnimation);
    var batchSkipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(inSkipAnimation);
    var xAxes = (0, hooks_1.useXAxes)().xAxis;
    var yAxes = (0, hooks_1.useYAxes)().yAxis;
    var _a = (0, useBarPlotData_1.useBarPlotData)((0, hooks_1.useDrawingArea)(), xAxes, yAxes), completedData = _a.completedData, masksData = _a.masksData;
    var classes = (0, barClasses_1.useUtilityClasses)();
    var BarElementPlot = renderer === 'svg-batch' ? BatchBarPlot_1.BatchBarPlot : IndividualBarPlot_1.IndividualBarPlot;
    return ((0, jsx_runtime_1.jsxs)(BarPlotRoot, { className: classes.root, children: [(0, jsx_runtime_1.jsx)(BarElementPlot, __assign({ completedData: completedData, masksData: masksData, 
                /* The batch renderer doesn't animate bars after the initial mount. Providing skipAnimation was causing an issue
                 * where bars would animate again after a zoom interaction because skipAnimation would change from true to false. */
                skipAnimation: renderer === 'svg-batch' ? batchSkipAnimation : skipAnimation, onItemClick: 
                /* `onItemClick` accepts a `MouseEvent` when the renderer is "svg-batch" and a `React.MouseEvent` otherwise,
                 * so we need this cast to prevent TypeScript from complaining. */
                onItemClick, borderRadius: borderRadius }, other)), completedData.map(function (processedSeries) { return ((0, jsx_runtime_1.jsx)(BarLabelPlot_1.BarLabelPlot, __assign({ className: classes.seriesLabels, processedSeries: processedSeries, skipAnimation: skipAnimation, barLabel: barLabel }, other), processedSeries.seriesId)); })] }));
}
BarPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * @deprecated Use `barLabel` in the chart series instead.
     * If provided, the function will be used to format the label of the bar.
     * It can be set to 'value' to display the current value.
     * @param {BarItem} item The item to format.
     * @param {BarLabelContext} context data about the bar.
     * @returns {string} The formatted label.
     */
    barLabel: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['value']), prop_types_1.default.func]),
    /**
     * Defines the border radius of the bar element.
     */
    borderRadius: prop_types_1.default.number,
    /**
     * Callback fired when a bar item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * The type of renderer to use for the bar plot.
     * - `svg-single`: Renders every bar in a `<rect />` element.
     * - `svg-batch`: Batch renders bars in `<path />` elements for better performance with large datasets, at the cost of some limitations.
     *                Read more: https://mui.com/x/react-charts/bars/#performance
     *
     * @default 'svg-single'
     */
    renderer: prop_types_1.default.oneOf(['svg-batch', 'svg-single']),
    /**
     * If `true`, animations are skipped.
     * @default undefined
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
