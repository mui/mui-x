"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarAxisHighlight = RadarAxisHighlight;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useRadarAxisHighlight_1 = require("./useRadarAxisHighlight");
var radarAxisHighlightClasses_1 = require("./radarAxisHighlightClasses");
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
    var center = data.center, series = data.series, points = data.points, radius = data.radius, highlightedAngle = data.highlightedAngle, instance = data.instance;
    var _a = instance.polar2svg(radius, highlightedAngle), x = _a[0], y = _a[1];
    return (<g className={classes.root}>
      <path d={"M ".concat(center.cx, " ").concat(center.cy, " L ").concat(x, " ").concat(y)} stroke={(theme.vars || theme).palette.text.primary} strokeWidth={1} className={classes.line} pointerEvents="none" strokeDasharray="4 4"/>
      {points.map(function (point, seriesIndex) {
            return (<circle key={series[seriesIndex].id} fill={series[seriesIndex].color} cx={point.x} cy={point.y} className={classes.dot} pointerEvents="none" {...(series[seriesIndex].hideMark ? highlightMark : highlightMarkShadow)}/>);
        })}
    </g>);
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
