"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharpRadarStripes = SharpRadarStripes;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var getPath = function (corners, center, outerRatio, innerRatio) {
    return [
        'M',
        __spreadArray(__spreadArray([], corners, true), [corners[0]], false).map(function (_a) {
            var x = _a.x, y = _a.y;
            return "".concat(center.x * (1 - outerRatio) + outerRatio * x, " ").concat(center.y * (1 - outerRatio) + outerRatio * y);
        })
            .join(' L '),
        'L',
        __spreadArray(__spreadArray([], corners, true), [corners[0]], false).reverse()
            .map(function (_a) {
            var x = _a.x, y = _a.y;
            return "".concat(center.x * (1 - innerRatio) + innerRatio * x, " ").concat(center.y * (1 - innerRatio) + innerRatio * y);
        })
            .join(' L '),
        'Z',
    ].join(' ');
};
/**
 * @ignore - internal component.
 */
function SharpRadarStripes(props) {
    var center = props.center, corners = props.corners, divisions = props.divisions, stripeColor = props.stripeColor, classes = props.classes;
    var divisionRatio = Array.from({ length: divisions }, function (_, index) { return (index + 1) / divisions; });
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: divisionRatio.map(function (ratio, index) {
            var _a, _b;
            var smallerRatio = (_a = divisionRatio[index - 1]) !== null && _a !== void 0 ? _a : 0;
            return ((0, jsx_runtime_1.jsx)("path", { d: getPath(corners, center, ratio, smallerRatio), stroke: "none", fill: (_b = stripeColor === null || stripeColor === void 0 ? void 0 : stripeColor(index)) !== null && _b !== void 0 ? _b : 'none', fillOpacity: 0.1, className: classes === null || classes === void 0 ? void 0 : classes.stripe }, ratio));
        }) }));
}
