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
exports.default = ChartsContinuousGradientObjectBound;
var jsx_runtime_1 = require("react/jsx-runtime");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var PX_PRECISION = 10;
var getDirection = function (isReversed) {
    if (isReversed) {
        return { x1: '1', x2: '0', y1: '0', y2: '0' };
    }
    return { x1: '0', x2: '1', y1: '0', y2: '0' };
};
/**
 * Generates gradients to be used in tooltips and legends.
 */
function ChartsContinuousGradientObjectBound(props) {
    var _a, _b;
    var isReversed = props.isReversed, gradientId = props.gradientId, colorScale = props.colorScale, colorMap = props.colorMap;
    var extremumValues = [(_a = colorMap.min) !== null && _a !== void 0 ? _a : 0, (_b = colorMap.max) !== null && _b !== void 0 ? _b : 100];
    var interpolator = typeof extremumValues[0] === 'number'
        ? (0, d3_interpolate_1.interpolateNumber)(extremumValues[0], extremumValues[1])
        : (0, d3_interpolate_1.interpolateDate)(extremumValues[0], extremumValues[1]);
    var numberOfPoints = PX_PRECISION;
    var keyPrefix = "".concat(extremumValues[0], "-").concat(extremumValues[1], "-");
    return ((0, jsx_runtime_1.jsx)("linearGradient", __assign({ id: gradientId }, getDirection(isReversed), { gradientUnits: 'objectBoundingBox', children: Array.from({ length: numberOfPoints + 1 }, function (_, index) {
            var offset = index / numberOfPoints;
            var value = interpolator(offset);
            if (value === undefined) {
                return null;
            }
            var color = colorScale(value);
            if (color === null) {
                return null;
            }
            return (0, jsx_runtime_1.jsx)("stop", { offset: offset, stopColor: color, stopOpacity: 1 }, keyPrefix + index);
        }) })));
}
