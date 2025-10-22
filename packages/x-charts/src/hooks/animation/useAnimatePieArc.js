"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimatePieArc = useAnimatePieArc;
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var useAnimate_1 = require("./useAnimate");
function pieArcPropsInterpolator(from, to) {
    var interpolateStartAngle = (0, d3_interpolate_1.interpolateNumber)(from.startAngle, to.startAngle);
    var interpolateEndAngle = (0, d3_interpolate_1.interpolateNumber)(from.endAngle, to.endAngle);
    var interpolateInnerRadius = (0, d3_interpolate_1.interpolateNumber)(from.innerRadius, to.innerRadius);
    var interpolateOuterRadius = (0, d3_interpolate_1.interpolateNumber)(from.outerRadius, to.outerRadius);
    var interpolatePaddingAngle = (0, d3_interpolate_1.interpolateNumber)(from.paddingAngle, to.paddingAngle);
    var interpolateCornerRadius = (0, d3_interpolate_1.interpolateNumber)(from.cornerRadius, to.cornerRadius);
    return function (t) {
        return {
            startAngle: interpolateStartAngle(t),
            endAngle: interpolateEndAngle(t),
            innerRadius: interpolateInnerRadius(t),
            outerRadius: interpolateOuterRadius(t),
            paddingAngle: interpolatePaddingAngle(t),
            cornerRadius: interpolateCornerRadius(t),
        };
    };
}
/** Animates a slice of a pie chart by increasing the start and end angles from the middle angle to their final values.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
function useAnimatePieArc(props) {
    var initialProps = {
        startAngle: (props.startAngle + props.endAngle) / 2,
        endAngle: (props.startAngle + props.endAngle) / 2,
        innerRadius: props.innerRadius,
        outerRadius: props.outerRadius,
        paddingAngle: props.paddingAngle,
        cornerRadius: props.cornerRadius,
    };
    return (0, useAnimate_1.useAnimate)({
        startAngle: props.startAngle,
        endAngle: props.endAngle,
        innerRadius: props.innerRadius,
        outerRadius: props.outerRadius,
        paddingAngle: props.paddingAngle,
        cornerRadius: props.cornerRadius,
    }, {
        createInterpolator: pieArcPropsInterpolator,
        transformProps: function (p) { return ({
            d: (0, d3_shape_1.arc)().cornerRadius(p.cornerRadius)({
                padAngle: p.paddingAngle,
                innerRadius: p.innerRadius,
                outerRadius: p.outerRadius,
                startAngle: p.startAngle,
                endAngle: p.endAngle,
            }),
            visibility: p.startAngle === p.endAngle ? 'hidden' : 'visible',
        }); },
        applyProps: function (element, p) {
            element.setAttribute('d', p.d);
            element.setAttribute('visibility', p.visibility);
        },
        initialProps: initialProps,
        skip: props.skipAnimation,
        ref: props.ref,
    });
}
