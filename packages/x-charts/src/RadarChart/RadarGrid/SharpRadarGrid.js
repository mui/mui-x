"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharpRadarGrid = SharpRadarGrid;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
/**
 * @ignore - internal component.
 */
function SharpRadarGrid(props) {
    var center = props.center, corners = props.corners, divisions = props.divisions, strokeColor = props.strokeColor, classes = props.classes;
    var divisionRatio = Array.from({ length: divisions }, function (_, index) { return (index + 1) / divisions; });
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [corners.map(function (_a, i) {
                var x = _a.x, y = _a.y;
                return ((0, jsx_runtime_1.jsx)("path", { d: "M ".concat(center.x, " ").concat(center.y, " L ").concat(x, " ").concat(y), stroke: strokeColor, strokeWidth: 1, strokeOpacity: 0.3, fill: "none", className: classes === null || classes === void 0 ? void 0 : classes.radial }, i));
            }), divisionRatio.map(function (ratio) { return ((0, jsx_runtime_1.jsx)("path", { d: "M ".concat(corners
                    .map(function (_a) {
                    var x = _a.x, y = _a.y;
                    return "".concat(center.x * (1 - ratio) + ratio * x, " ").concat(center.y * (1 - ratio) + ratio * y);
                })
                    .join(' L '), " Z"), stroke: strokeColor, strokeWidth: 1, strokeOpacity: 0.3, fill: "none", className: classes === null || classes === void 0 ? void 0 : classes.divider }, ratio)); })] }));
}
