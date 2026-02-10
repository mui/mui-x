"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartsPiecewiseGradient;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
function ChartsPiecewiseGradient(props) {
    var _a;
    var isReversed = props.isReversed, gradientId = props.gradientId, size = props.size, direction = props.direction, scale = props.scale, colorMap = props.colorMap;
    if (size <= 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("linearGradient", (_a = { id: gradientId, x1: "0", x2: "0", y1: "0", y2: "0" }, _a["".concat(direction).concat(isReversed ? 1 : 2)] = "".concat(size, "px"), _a.gradientUnits = "userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
    , _a.children = colorMap.thresholds.map(function (threshold, index) {
        var x = scale(threshold);
        if (x === undefined) {
            return null;
        }
        var offset = isReversed ? 1 - x / size : x / size;
        if (Number.isNaN(offset)) {
            return null;
        }
        return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)("stop", { offset: offset, stopColor: colorMap.colors[index], stopOpacity: 1 }), (0, jsx_runtime_1.jsx)("stop", { offset: offset, stopColor: colorMap.colors[index + 1], stopOpacity: 1 })] }, threshold.toString() + index));
    }), _a)));
}
