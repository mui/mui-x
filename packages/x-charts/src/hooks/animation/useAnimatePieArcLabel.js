"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimatePieArcLabel = useAnimatePieArcLabel;
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var useAnimate_1 = require("./useAnimate");
function pieArcLabelPropsInterpolator(from, to) {
    var interpolateStartAngle = (0, d3_interpolate_1.interpolateNumber)(from.startAngle, to.startAngle);
    var interpolateEndAngle = (0, d3_interpolate_1.interpolateNumber)(from.endAngle, to.endAngle);
    var interpolateArcLabelRadius = (0, d3_interpolate_1.interpolateNumber)(from.arcLabelRadius, to.arcLabelRadius);
    var interpolatePaddingAngle = (0, d3_interpolate_1.interpolateNumber)(from.paddingAngle, to.paddingAngle);
    var interpolateCornerRadius = (0, d3_interpolate_1.interpolateNumber)(from.cornerRadius, to.cornerRadius);
    return function (t) {
        return {
            startAngle: interpolateStartAngle(t),
            endAngle: interpolateEndAngle(t),
            arcLabelRadius: interpolateArcLabelRadius(t),
            paddingAngle: interpolatePaddingAngle(t),
            cornerRadius: interpolateCornerRadius(t),
        };
    };
}
/** Animates the label of pie slice from its middle point to the centroid of the slice.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
function useAnimatePieArcLabel(props) {
    var initialProps = {
        startAngle: (props.startAngle + props.endAngle) / 2,
        endAngle: (props.startAngle + props.endAngle) / 2,
        arcLabelRadius: props.arcLabelRadius,
        paddingAngle: props.paddingAngle,
        cornerRadius: props.cornerRadius,
    };
    return (0, useAnimate_1.useAnimate)({
        startAngle: props.startAngle,
        endAngle: props.endAngle,
        arcLabelRadius: props.arcLabelRadius,
        paddingAngle: props.paddingAngle,
        cornerRadius: props.cornerRadius,
    }, {
        createInterpolator: pieArcLabelPropsInterpolator,
        transformProps: function (animatedProps) {
            var _a = (0, d3_shape_1.arc)().cornerRadius(animatedProps.cornerRadius).centroid({
                padAngle: animatedProps.paddingAngle,
                startAngle: animatedProps.startAngle,
                endAngle: animatedProps.endAngle,
                innerRadius: animatedProps.arcLabelRadius,
                outerRadius: animatedProps.arcLabelRadius,
            }), x = _a[0], y = _a[1];
            return { x: x, y: y };
        },
        applyProps: function (element, _a) {
            var x = _a.x, y = _a.y;
            element.setAttribute('x', x.toString());
            element.setAttribute('y', y.toString());
        },
        initialProps: initialProps,
        skip: props.skipAnimation,
        ref: props.ref,
    });
}
