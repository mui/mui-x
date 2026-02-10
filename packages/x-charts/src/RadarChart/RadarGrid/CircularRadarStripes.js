"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularRadarStripes = CircularRadarStripes;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var getPath = function (center, outerRadius, innerRadius) {
    return [
        "M ".concat(center.x - outerRadius, " ").concat(center.y),
        "A ".concat(outerRadius, " ").concat(outerRadius, " 0 1 0 ").concat(center.x + outerRadius, " ").concat(center.y),
        "A ".concat(outerRadius, " ").concat(outerRadius, " 0 1 0 ").concat(center.x - outerRadius, " ").concat(center.y, " Z"),
        "M ".concat(center.x - innerRadius, " ").concat(center.y),
        "A ".concat(innerRadius, " ").concat(innerRadius, " 0 1 0 ").concat(center.x + innerRadius, " ").concat(center.y),
        "A ".concat(innerRadius, " ").concat(innerRadius, " 0 1 0 ").concat(center.x - innerRadius, " ").concat(center.y, " Z"),
    ].join('');
};
/**
 * @ignore - internal component.
 */
function CircularRadarStripes(props) {
    var center = props.center, divisions = props.divisions, radius = props.radius, stripeColor = props.stripeColor, classes = props.classes;
    var divisionRadius = Array.from({ length: divisions }, function (_, index) { return (radius * (index + 1)) / divisions; });
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: divisionRadius.map(function (r, index) {
            var _a, _b;
            var smallerRadius = (_a = divisionRadius[index - 1]) !== null && _a !== void 0 ? _a : 0;
            return ((0, jsx_runtime_1.jsx)("path", { d: getPath(center, r, smallerRadius), fillRule: "evenodd", fill: (_b = stripeColor === null || stripeColor === void 0 ? void 0 : stripeColor(index)) !== null && _b !== void 0 ? _b : 'none', fillOpacity: 0.1, className: classes === null || classes === void 0 ? void 0 : classes.stripe }, r));
        }) }));
}
