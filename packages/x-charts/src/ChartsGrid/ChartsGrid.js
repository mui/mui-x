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
exports.ChartsGrid = ChartsGrid;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var styles_1 = require("@mui/material/styles");
var chartsGridClasses_1 = require("./chartsGridClasses");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var styledComponents_1 = require("./styledComponents");
var ChartsVerticalGrid_1 = require("./ChartsVerticalGrid");
var ChartsHorizontalGrid_1 = require("./ChartsHorizontalGrid");
var useAxis_1 = require("../hooks/useAxis");
var useUtilityClasses = function (_a) {
    var classes = _a.classes;
    var slots = {
        root: ['root'],
        verticalLine: ['line', 'verticalLine'],
        horizontalLine: ['line', 'horizontalLine'],
    };
    return (0, composeClasses_1.default)(slots, chartsGridClasses_1.getChartsGridUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsGrid API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsGrid(inProps) {
    var props = (0, styles_1.useThemeProps)({ props: inProps, name: 'MuiChartsGrid' });
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var vertical = props.vertical, horizontal = props.horizontal, other = __rest(props, ["vertical", "horizontal"]);
    var _a = (0, useAxis_1.useXAxes)(), xAxis = _a.xAxis, xAxisIds = _a.xAxisIds;
    var _b = (0, useAxis_1.useYAxes)(), yAxis = _b.yAxis, yAxisIds = _b.yAxisIds;
    var classes = useUtilityClasses(props);
    var horizontalAxis = yAxis[yAxisIds[0]];
    var verticalAxis = xAxis[xAxisIds[0]];
    return ((0, jsx_runtime_1.jsxs)(styledComponents_1.GridRoot, __assign({}, other, { className: classes.root, children: [vertical && ((0, jsx_runtime_1.jsx)(ChartsVerticalGrid_1.ChartsGridVertical, { axis: verticalAxis, start: drawingArea.top, end: drawingArea.height + drawingArea.top, classes: classes })), horizontal && ((0, jsx_runtime_1.jsx)(ChartsHorizontalGrid_1.ChartsGridHorizontal, { axis: horizontalAxis, start: drawingArea.left, end: drawingArea.width + drawingArea.left, classes: classes }))] })));
}
ChartsGrid.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    /**
     * Displays horizontal grid.
     */
    horizontal: prop_types_1.default.bool,
    /**
     * Displays vertical grid.
     */
    vertical: prop_types_1.default.bool,
};
