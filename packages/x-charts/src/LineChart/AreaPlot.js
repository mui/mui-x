"use strict";
'use client';
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
exports.AreaPlot = AreaPlot;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var AreaElement_1 = require("./AreaElement");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var useAxis_1 = require("../hooks/useAxis");
var useInternalIsZoomInteracting_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting");
var useAreaPlotData_1 = require("./useAreaPlotData");
var AreaPlotRoot = (0, styles_1.styled)('g', {
    name: 'MuiAreaPlot',
    slot: 'Root',
})((_a = {},
    _a["& .".concat(AreaElement_1.areaElementClasses.root)] = {
        transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    },
    _a));
var useAggregatedData = function () {
    var xAxes = (0, useAxis_1.useXAxes)().xAxis;
    var yAxes = (0, useAxis_1.useYAxes)().yAxis;
    return (0, useAreaPlotData_1.useAreaPlotData)(xAxes, yAxes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [AreaPlot API](https://mui.com/x/api/charts/area-plot/)
 */
function AreaPlot(props) {
    var slots = props.slots, slotProps = props.slotProps, onItemClick = props.onItemClick, inSkipAnimation = props.skipAnimation, other = __rest(props, ["slots", "slotProps", "onItemClick", "skipAnimation"]);
    var isZoomInteracting = (0, useInternalIsZoomInteracting_1.useInternalIsZoomInteracting)();
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(isZoomInteracting || inSkipAnimation);
    var completedData = useAggregatedData();
    return (<AreaPlotRoot {...other}>
      {completedData.map(function (_a) {
            var d = _a.d, seriesId = _a.seriesId, color = _a.color, area = _a.area, gradientId = _a.gradientId;
            return !!area && (<AreaElement_1.AreaElement key={seriesId} id={seriesId} d={d} color={color} gradientId={gradientId} slots={slots} slotProps={slotProps} onClick={onItemClick && (function (event) { return onItemClick(event, { type: 'line', seriesId: seriesId }); })} skipAnimation={skipAnimation}/>);
        })}
    </AreaPlotRoot>);
}
AreaPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Callback fired when a line area item is clicked.
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
