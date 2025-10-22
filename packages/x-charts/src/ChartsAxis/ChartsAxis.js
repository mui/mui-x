"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsAxis = ChartsAxis;
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
    var slots = props.slots, slotProps = props.slotProps;
    var _a = (0, hooks_1.useXAxes)(), xAxisIds = _a.xAxisIds, xAxis = _a.xAxis;
    var _b = (0, hooks_1.useYAxes)(), yAxisIds = _b.yAxisIds, yAxis = _b.yAxis;
    return (<React.Fragment>
      {xAxisIds.map(function (axisId) {
            if (!xAxis[axisId].position || xAxis[axisId].position === 'none') {
                return null;
            }
            return <ChartsXAxis_1.ChartsXAxis key={axisId} slots={slots} slotProps={slotProps} axisId={axisId}/>;
        })}
      {yAxisIds.map(function (axisId) {
            if (!yAxis[axisId].position || yAxis[axisId].position === 'none') {
                return null;
            }
            return <ChartsYAxis_1.ChartsYAxis key={axisId} slots={slots} slotProps={slotProps} axisId={axisId}/>;
        })}
    </React.Fragment>);
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
