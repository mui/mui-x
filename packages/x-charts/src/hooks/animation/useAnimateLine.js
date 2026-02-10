"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimateLine = useAnimateLine;
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var useAnimate_1 = require("./useAnimate");
/** Animates a line of a line chart using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
function useAnimateLine(props) {
    return (0, useAnimate_1.useAnimate)({ d: props.d }, {
        createInterpolator: function (lastProps, newProps) {
            var interpolate = (0, d3_interpolate_1.interpolateString)(lastProps.d, newProps.d);
            return function (t) { return ({ d: interpolate(t) }); };
        },
        applyProps: function (element, _a) {
            var d = _a.d;
            return element.setAttribute('d', d);
        },
        skip: props.skipAnimation,
        transformProps: function (p) { return p; },
        ref: props.ref,
    });
}
