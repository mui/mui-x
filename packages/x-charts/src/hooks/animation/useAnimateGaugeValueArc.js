"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimateGaugeValueArc = useAnimateGaugeValueArc;
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var useAnimate_1 = require("./useAnimate");
function gaugeValueArcPropsInterpolator(from, to) {
    var interpolateStartAngle = (0, d3_interpolate_1.interpolateNumber)(from.startAngle, to.startAngle);
    var interpolateEndAngle = (0, d3_interpolate_1.interpolateNumber)(from.endAngle, to.endAngle);
    var interpolateInnerRadius = (0, d3_interpolate_1.interpolateNumber)(from.innerRadius, to.innerRadius);
    var interpolateOuterRadius = (0, d3_interpolate_1.interpolateNumber)(from.outerRadius, to.outerRadius);
    var interpolateCornerRadius = (0, d3_interpolate_1.interpolateNumber)(from.cornerRadius, to.cornerRadius);
    return function (t) {
        return {
            startAngle: interpolateStartAngle(t),
            endAngle: interpolateEndAngle(t),
            innerRadius: interpolateInnerRadius(t),
            outerRadius: interpolateOuterRadius(t),
            cornerRadius: interpolateCornerRadius(t),
        };
    };
}
/** Animates a arc of a gauge chart by increasing the `endAngle` from the start angle to the end angle.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
function useAnimateGaugeValueArc(props) {
    return (0, useAnimate_1.useAnimate)({
        startAngle: props.startAngle,
        endAngle: props.endAngle,
        innerRadius: props.innerRadius,
        outerRadius: props.outerRadius,
        cornerRadius: props.cornerRadius,
    }, {
        createInterpolator: gaugeValueArcPropsInterpolator,
        transformProps: function (p) { return ({
            d: (0, d3_shape_1.arc)().cornerRadius(p.cornerRadius)({
                innerRadius: p.innerRadius,
                outerRadius: p.outerRadius,
                startAngle: p.startAngle,
                endAngle: p.endAngle,
            }),
        }); },
        applyProps: function (element, p) {
            element.setAttribute('d', p.d);
        },
        initialProps: {
            startAngle: props.startAngle,
            endAngle: props.startAngle,
            innerRadius: props.innerRadius,
            outerRadius: props.outerRadius,
            cornerRadius: props.cornerRadius,
        },
        skip: props.skipAnimation,
        ref: props.ref,
    });
}
