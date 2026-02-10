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
exports.getXAxisCoordinates = getXAxisCoordinates;
exports.useXAxisCoordinates = useXAxisCoordinates;
exports.getYAxisCoordinates = getYAxisCoordinates;
exports.useYAxisCoordinates = useYAxisCoordinates;
var styles_1 = require("@mui/material/styles");
var useDrawingArea_1 = require("./useDrawingArea");
var useAxis_1 = require("./useAxis");
var utilities_1 = require("../ChartsXAxis/utilities");
function getXAxisCoordinates(drawingArea, computedAxis) {
    var position = computedAxis.position, offset = computedAxis.offset, axisHeight = computedAxis.height;
    if (position === 'none') {
        return null;
    }
    var top;
    if (position === 'top') {
        top = drawingArea.top - axisHeight - offset;
    }
    else {
        top = drawingArea.top + drawingArea.height + offset;
    }
    var left = drawingArea.left;
    var bottom = top + axisHeight;
    var right = drawingArea.left + drawingArea.width;
    return {
        left: left,
        top: top,
        right: right,
        bottom: bottom,
    };
}
/**
 * Get the coordinates of the given X axis. The coordinates are relative to the SVG's origin.
 * @param axisId The id of the X axis.
 * @returns {AxisCoordinates | null} The coordinates of the X axis or null if the axis does not exist or has position: 'none'.
 */
function useXAxisCoordinates(axisId) {
    var xAxes = (0, useAxis_1.useXAxes)().xAxis;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var axis = xAxes[axisId];
    // FIXME(v9): Remove
    // eslint-disable-next-line mui/material-ui-name-matches-component-name
    var themedProps = (0, styles_1.useThemeProps)({ props: axis, name: 'MuiChartsXAxis' });
    if (!axis) {
        return null;
    }
    var defaultizedProps = __assign(__assign({}, utilities_1.defaultProps), themedProps);
    return getXAxisCoordinates(drawingArea, defaultizedProps);
}
function getYAxisCoordinates(drawingArea, computedAxis) {
    var position = computedAxis.position, offset = computedAxis.offset, axisWidth = computedAxis.width;
    if (position === 'none') {
        return null;
    }
    var left;
    if (position === 'right') {
        left = drawingArea.left + drawingArea.width + offset;
    }
    else {
        left = drawingArea.left - axisWidth - offset;
    }
    var top = drawingArea.top;
    var bottom = drawingArea.top + drawingArea.height;
    var right = left + axisWidth;
    return {
        left: left,
        top: top,
        right: right,
        bottom: bottom,
    };
}
/**
 * Returns the coordinates of the given Y axis. The coordinates are relative to the SVG's origin.
 * @param axisId The id of the Y axis.
 * @returns {AxisCoordinates | null} The coordinates of the Y axis or null if the axis does not exist or has position: 'none'.
 */
function useYAxisCoordinates(axisId) {
    var yAxes = (0, useAxis_1.useYAxes)().yAxis;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var axis = yAxes[axisId];
    // FIXME(v9): Remove
    // eslint-disable-next-line mui/material-ui-name-matches-component-name
    var themedProps = (0, styles_1.useThemeProps)({ props: axis, name: 'MuiChartsYAxis' });
    if (!axis) {
        return null;
    }
    var defaultizedProps = __assign(__assign({}, utilities_1.defaultProps), themedProps);
    return getYAxisCoordinates(drawingArea, defaultizedProps);
}
