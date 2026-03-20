"use strict";
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
exports.useXAxisTicks = useXAxisTicks;
exports.useYAxisTicks = useYAxisTicks;
var styles_1 = require("@mui/material/styles");
var useAxis_1 = require("./useAxis");
var useTicks_1 = require("./useTicks");
var utilities_1 = require("../ChartsXAxis/utilities");
/**
 * Returns the ticks for the given X axis. Ticks outside the drawing area are not included.
 * The ticks returned from this hook are not grouped, i.e., they don't follow the `groups` prop of the axis.
 * @param axisId The id of the X axis.
 */
function useXAxisTicks(axisId) {
    var xAxes = (0, useAxis_1.useXAxes)().xAxis;
    var axis = xAxes[axisId];
    // FIXME: `useAxisTicksProps` does this, but should we do it here?
    // eslint-disable-next-line mui/material-ui-name-matches-component-name
    var themedProps = (0, styles_1.useThemeProps)({ props: axis, name: 'MuiChartsXAxis' });
    var defaultizedProps = __assign(__assign({}, utilities_1.defaultProps), themedProps);
    return (0, useTicks_1.useTicks)({
        scale: axis.scale,
        tickNumber: axis.tickNumber,
        valueFormatter: defaultizedProps.valueFormatter,
        tickInterval: defaultizedProps.tickInterval,
        tickPlacement: defaultizedProps.tickPlacement,
        tickLabelPlacement: defaultizedProps.tickLabelPlacement,
        tickSpacing: defaultizedProps.tickSpacing,
        direction: 'x',
        ordinalTimeTicks: 'ordinalTimeTicks' in defaultizedProps ? defaultizedProps.ordinalTimeTicks : undefined,
    });
}
/**
 * Returns the ticks for the given Y axis. Ticks outside the drawing area are not included.
 * The ticks returned from this hook are not grouped, i.e., they don't follow the `groups` prop of the axis.
 * @param axisId The id of the Y axis.
 */
function useYAxisTicks(axisId) {
    var yAxes = (0, useAxis_1.useYAxes)().yAxis;
    var axis = yAxes[axisId];
    // FIXME: `useAxisTicksProps` does this, but should we do it here?
    // eslint-disable-next-line mui/material-ui-name-matches-component-name
    var themedProps = (0, styles_1.useThemeProps)({ props: axis, name: 'MuiChartsYAxis' });
    var defaultizedProps = __assign(__assign({}, utilities_1.defaultProps), themedProps);
    return (0, useTicks_1.useTicks)({
        scale: axis.scale,
        tickNumber: axis.tickNumber,
        valueFormatter: defaultizedProps.valueFormatter,
        tickInterval: defaultizedProps.tickInterval,
        tickPlacement: defaultizedProps.tickPlacement,
        tickLabelPlacement: defaultizedProps.tickLabelPlacement,
        tickSpacing: defaultizedProps.tickSpacing,
        direction: 'y',
        // @ts-expect-error
        ordinalTimeTicks: defaultizedProps.ordinalTimeTicks,
    });
}
