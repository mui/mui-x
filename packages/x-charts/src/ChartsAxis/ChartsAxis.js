"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsAxis = ChartsAxis;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var ChartsXAxis_1 = require("../ChartsXAxis");
var ChartsYAxis_1 = require("../ChartsYAxis");
var hooks_1 = require("../hooks");
/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsAxis API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsAxis(props) {
    var _a, _b;
    var slots = props.slots, slotProps = props.slotProps;
    var _c = (0, hooks_1.useXAxes)(), xAxisIds = _c.xAxisIds, xAxis = _c.xAxis;
    var _d = (0, hooks_1.useYAxes)(), yAxisIds = _d.yAxisIds, yAxis = _d.yAxis;
    var XAxis = (_a = slots === null || slots === void 0 ? void 0 : slots.xAxis) !== null && _a !== void 0 ? _a : ChartsXAxis_1.ChartsXAxis;
    var YAxis = (_b = slots === null || slots === void 0 ? void 0 : slots.yAxis) !== null && _b !== void 0 ? _b : ChartsYAxis_1.ChartsYAxis;
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [xAxisIds.map(function (axisId) {
                if (!xAxis[axisId].position || xAxis[axisId].position === 'none') {
                    return null;
                }
                return (0, jsx_runtime_1.jsx)(XAxis, { slots: slots, slotProps: slotProps, axisId: axisId }, axisId);
            }), yAxisIds.map(function (axisId) {
                if (!yAxis[axisId].position || yAxis[axisId].position === 'none') {
                    return null;
                }
                return (0, jsx_runtime_1.jsx)(YAxis, { slots: slots, slotProps: slotProps, axisId: axisId }, axisId);
            })] }));
}
ChartsAxis.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
