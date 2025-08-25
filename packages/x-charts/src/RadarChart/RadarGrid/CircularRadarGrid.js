"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularRadarGrid = CircularRadarGrid;
var React = require("react");
/**
 * @ignore - internal component.
 */
function CircularRadarGrid(props) {
    var center = props.center, corners = props.corners, divisions = props.divisions, radius = props.radius, strokeColor = props.strokeColor, classes = props.classes;
    var divisionRadius = Array.from({ length: divisions }, function (_, index) { return (radius * (index + 1)) / divisions; });
    return (<React.Fragment>
      {corners.map(function (_a, i) {
            var x = _a.x, y = _a.y;
            return (<path key={i} d={"M ".concat(center.x, " ").concat(center.y, " L ").concat(x, " ").concat(y)} stroke={strokeColor} strokeWidth={1} strokeOpacity={0.3} fill="none" className={classes === null || classes === void 0 ? void 0 : classes.radial}/>);
        })}
      {divisionRadius.map(function (r) { return (<circle key={r} cx={center.x} cy={center.y} r={r} stroke={strokeColor} strokeWidth={1} strokeOpacity={0.3} fill="none" className={classes === null || classes === void 0 ? void 0 : classes.divider}/>); })}
    </React.Fragment>);
}
