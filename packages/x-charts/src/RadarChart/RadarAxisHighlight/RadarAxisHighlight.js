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
exports.RadarAxisHighlight = RadarAxisHighlight;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useRadarAxisHighlight_1 = require("./useRadarAxisHighlight");
var radarAxisHighlightClasses_1 = require("./radarAxisHighlightClasses");
var getSeriesColorFn_1 = require("../../internals/getSeriesColorFn");
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        line: ['line'],
        dot: ['dot'],
    };
    return (0, composeClasses_1.default)(slots, radarAxisHighlightClasses_1.getRadarAxisHighlightUtilityClass, classes);
};
/**
 * Attributes to display a shadow around a mark.
 */
var highlightMarkShadow = {
    r: 7,
    opacity: 0.3,
};
/**
 * Attributes to display a mark.
 */
var highlightMark = {
    r: 3,
    opacity: 1,
};
function RadarAxisHighlight(props) {
    var classes = useUtilityClasses(props.classes);
    var theme = (0, styles_1.useTheme)();
    var data = (0, useRadarAxisHighlight_1.useRadarAxisHighlight)();
    if (data === null) {
        return null;
    }
    var center = data.center, series = data.series, points = data.points, radius = data.radius, highlightedAngle = data.highlightedAngle, highlightedIndex = data.highlightedIndex, instance = data.instance;
    var _a = instance.polar2svg(radius, highlightedAngle), x = _a[0], y = _a[1];
    return ((0, jsx_runtime_1.jsxs)("g", { className: classes.root, children: [(0, jsx_runtime_1.jsx)("path", { d: "M ".concat(center.cx, " ").concat(center.cy, " L ").concat(x, " ").concat(y), stroke: (theme.vars || theme).palette.text.primary, strokeWidth: 1, className: classes.line, pointerEvents: "none", strokeDasharray: "4 4" }), points.map(function (point, seriesIndex) {
                var colorGetter = (0, getSeriesColorFn_1.getSeriesColorFn)(series[seriesIndex]);
                return ((0, jsx_runtime_1.jsx)("circle", __assign({ fill: colorGetter({ value: point.value, dataIndex: highlightedIndex }), cx: point.x, cy: point.y, className: classes.dot, pointerEvents: "none" }, (series[seriesIndex].hideMark ? highlightMark : highlightMarkShadow)), series[seriesIndex].id));
            })] }));
}
RadarAxisHighlight.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
};
