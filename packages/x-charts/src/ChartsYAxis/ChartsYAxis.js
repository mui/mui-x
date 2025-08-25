"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsYAxis = ChartsYAxis;
var React = require("react");
var prop_types_1 = require("prop-types");
var useAxis_1 = require("../hooks/useAxis");
var ChartsSingleYAxis_1 = require("./ChartsSingleYAxis");
var ChartsGroupedYAxis_1 = require("./ChartsGroupedYAxis");
/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsYAxis API](https://mui.com/x/api/charts/charts-y-axis/)
 */
function ChartsYAxis(inProps) {
    var _a;
    var _b = (0, useAxis_1.useYAxes)(), yAxis = _b.yAxis, yAxisIds = _b.yAxisIds;
    var axis = yAxis[(_a = inProps.axisId) !== null && _a !== void 0 ? _a : yAxisIds[0]];
    if ('groups' in axis && Array.isArray(axis.groups)) {
        return <ChartsGroupedYAxis_1.ChartsGroupedYAxis {...inProps}/>;
    }
    return <ChartsSingleYAxis_1.ChartsSingleYAxis {...inProps}/>;
}
ChartsYAxis.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    axis: prop_types_1.default.oneOf(['y']),
    /**
     * The id of the axis to render.
     * If undefined, it will be the first defined axis.
     */
    axisId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * If true, the axis line is disabled.
     * @default false
     */
    disableLine: prop_types_1.default.bool,
    /**
     * If true, the ticks are disabled.
     * @default false
     */
    disableTicks: prop_types_1.default.bool,
    /**
     * The label of the axis.
     */
    label: prop_types_1.default.string,
    /**
     * The style applied to the axis label.
     */
    labelStyle: prop_types_1.default.object,
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
    /**
     * Defines which ticks are displayed.
     * Its value can be:
     * - 'auto' In such case the ticks are computed based on axis scale and other parameters.
     * - a filtering function of the form `(value, index) => boolean` which is available only if the axis has "point" scale.
     * - an array containing the values where ticks should be displayed.
     * @see See {@link https://mui.com/x/react-charts/axis/#fixed-tick-positions}
     * @default 'auto'
     */
    tickInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.array, prop_types_1.default.func]),
    /**
     * Defines which ticks get its label displayed. Its value can be:
     * - 'auto' In such case, labels are displayed if they do not overlap with the previous one.
     * - a filtering function of the form (value, index) => boolean. Warning: the index is tick index, not data ones.
     * @default 'auto'
     */
    tickLabelInterval: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.func]),
    /**
     * The placement of ticks label. Can be the middle of the band, or the tick position.
     * Only used if scale is 'band'.
     * @default 'middle'
     */
    tickLabelPlacement: prop_types_1.default.oneOf(['middle', 'tick']),
    /**
     * The style applied to ticks text.
     */
    tickLabelStyle: prop_types_1.default.object,
    /**
     * Maximal step between two ticks.
     * When using time data, the value is assumed to be in ms.
     * Not supported by categorical axis (band, points).
     */
    tickMaxStep: prop_types_1.default.number,
    /**
     * Minimal step between two ticks.
     * When using time data, the value is assumed to be in ms.
     * Not supported by categorical axis (band, points).
     */
    tickMinStep: prop_types_1.default.number,
    /**
     * The number of ticks. This number is not guaranteed.
     * Not supported by categorical axis (band, points).
     */
    tickNumber: prop_types_1.default.number,
    /**
     * The placement of ticks in regard to the band interval.
     * Only used if scale is 'band'.
     * @default 'extremities'
     */
    tickPlacement: prop_types_1.default.oneOf(['end', 'extremities', 'middle', 'start']),
    /**
     * The size of the ticks.
     * @default 6
     */
    tickSize: prop_types_1.default.number,
};
