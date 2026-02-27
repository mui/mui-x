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
exports.LinePlot = LinePlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var LineElement_1 = require("./LineElement");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var hooks_1 = require("../hooks");
var useInternalIsZoomInteracting_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting");
var useLinePlotData_1 = require("./useLinePlotData");
var animation_1 = require("../internals/animation/animation");
var LinePlotRoot = (0, styles_1.styled)('g', {
    name: 'MuiAreaPlot',
    slot: 'Root',
})((_a = {},
    _a["& .".concat(LineElement_1.lineElementClasses.root)] = {
        transitionProperty: 'opacity, fill',
        transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
        transitionTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION,
    },
    _a));
var useAggregatedData = function () {
    var xAxes = (0, hooks_1.useXAxes)().xAxis;
    var yAxes = (0, hooks_1.useYAxes)().yAxis;
    return (0, useLinePlotData_1.useLinePlotData)(xAxes, yAxes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LinePlot API](https://mui.com/x/api/charts/line-plot/)
 */
function LinePlot(props) {
    var slots = props.slots, slotProps = props.slotProps, inSkipAnimation = props.skipAnimation, onItemClick = props.onItemClick, other = __rest(props, ["slots", "slotProps", "skipAnimation", "onItemClick"]);
    var isZoomInteracting = (0, useInternalIsZoomInteracting_1.useInternalIsZoomInteracting)();
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(isZoomInteracting || inSkipAnimation);
    var completedData = useAggregatedData();
    return ((0, jsx_runtime_1.jsx)(LinePlotRoot, __assign({}, other, { children: completedData.map(function (_a) {
            var d = _a.d, seriesId = _a.seriesId, color = _a.color, gradientId = _a.gradientId, hidden = _a.hidden;
            return ((0, jsx_runtime_1.jsx)(LineElement_1.LineElement, { seriesId: seriesId, d: d, color: color, gradientId: gradientId, hidden: hidden, skipAnimation: skipAnimation, slots: slots, slotProps: slotProps, onClick: onItemClick && (function (event) { return onItemClick(event, { type: 'line', seriesId: seriesId }); }) }, seriesId));
        }) })));
}
LinePlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Callback fired when a line item is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * If `true`, animations are skipped.
     * @default false
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
