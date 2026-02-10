"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChartsContinuousGradient;
var jsx_runtime_1 = require("react/jsx-runtime");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var PX_PRECISION = 10;
function ChartsContinuousGradient(props) {
    var _a;
    var _b, _c;
    var gradientUnits = props.gradientUnits, isReversed = props.isReversed, gradientId = props.gradientId, size = props.size, direction = props.direction, scale = props.scale, colorScale = props.colorScale, colorMap = props.colorMap;
    var extremumValues = [(_b = colorMap.min) !== null && _b !== void 0 ? _b : 0, (_c = colorMap.max) !== null && _c !== void 0 ? _c : 100];
    var extremumPositions = extremumValues.map(scale).filter(function (p) { return p !== undefined; });
    if (extremumPositions.length !== 2) {
        return null;
    }
    var interpolator = typeof extremumValues[0] === 'number'
        ? (0, d3_interpolate_1.interpolateNumber)(extremumValues[0], extremumValues[1])
        : (0, d3_interpolate_1.interpolateDate)(extremumValues[0], extremumValues[1]);
    var numberOfPoints = Math.round((Math.max.apply(Math, extremumPositions) - Math.min.apply(Math, extremumPositions)) / PX_PRECISION);
    var keyPrefix = "".concat(extremumValues[0], "-").concat(extremumValues[1], "-");
    return ((0, jsx_runtime_1.jsx)("linearGradient", (_a = { id: gradientId, x1: "0", x2: "0", y1: "0", y2: "0" }, _a["".concat(direction).concat(isReversed ? 1 : 2)] = gradientUnits === 'objectBoundingBox' ? 1 : "".concat(size, "px"), _a.gradientUnits = gradientUnits !== null && gradientUnits !== void 0 ? gradientUnits : 'userSpaceOnUse', _a.children = Array.from({ length: numberOfPoints + 1 }, function (_, index) {
        var value = interpolator(index / numberOfPoints);
        if (value === undefined) {
            return null;
        }
        var x = scale(value);
        if (x === undefined) {
            return null;
        }
        var offset = isReversed ? 1 - x / size : x / size;
        var color = colorScale(value);
        if (color === null) {
            return null;
        }
        return (0, jsx_runtime_1.jsx)("stop", { offset: offset, stopColor: color, stopOpacity: 1 }, keyPrefix + index);
    }), _a)));
}
