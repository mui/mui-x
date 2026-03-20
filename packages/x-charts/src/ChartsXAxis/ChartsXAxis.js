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
exports.ChartsXAxis = ChartsXAxis;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var warning_1 = require("@mui/x-internals/warning");
var useAxis_1 = require("../hooks/useAxis");
var ChartsXAxisImpl_1 = require("./ChartsXAxisImpl");
/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsXAxis API](https://mui.com/x/api/charts/charts-x-axis/)
 */
function ChartsXAxis(inProps) {
    var _a;
    var _b = (0, useAxis_1.useXAxes)(), xAxis = _b.xAxis, xAxisIds = _b.xAxisIds;
    var axis = xAxis[(_a = inProps.axisId) !== null && _a !== void 0 ? _a : xAxisIds[0]];
    if (!axis) {
        (0, warning_1.warnOnce)("MUI X Charts: No axis found. The axisId \"".concat(inProps.axisId, "\" is probably invalid."));
        return null;
    }
    return (0, jsx_runtime_1.jsx)(ChartsXAxisImpl_1.ChartsXAxisImpl, __assign({}, inProps, { axis: axis }));
}
ChartsXAxis.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    axis: prop_types_1.default.oneOf(['x']),
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
     * The minimum gap in pixels between two tick labels.
     * If two tick labels are closer than this minimum gap, one of them will be hidden.
     * @default 4
     */
    tickLabelMinGap: prop_types_1.default.number,
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
