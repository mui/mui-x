"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularRadarGrid = CircularRadarGrid;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
/**
 * @ignore - internal component.
 */
function CircularRadarGrid(props) {
    var center = props.center, corners = props.corners, divisions = props.divisions, radius = props.radius, strokeColor = props.strokeColor, classes = props.classes;
    var divisionRadius = Array.from({ length: divisions }, function (_, index) { return (radius * (index + 1)) / divisions; });
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [corners.map(function (_a, i) {
                var x = _a.x, y = _a.y;
                return ((0, jsx_runtime_1.jsx)("path", { d: "M ".concat(center.x, " ").concat(center.y, " L ").concat(x, " ").concat(y), stroke: strokeColor, strokeWidth: 1, strokeOpacity: 0.3, fill: "none", className: classes === null || classes === void 0 ? void 0 : classes.radial }, i));
            }), divisionRadius.map(function (r) { return ((0, jsx_runtime_1.jsx)("circle", { cx: center.x, cy: center.y, r: r, stroke: strokeColor, strokeWidth: 1, strokeOpacity: 0.3, fill: "none", className: classes === null || classes === void 0 ? void 0 : classes.divider }, r)); })] }));
}
