"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimateBar = useAnimateBar;
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var useAnimate_1 = require("./useAnimate");
function barPropsInterpolator(from, to) {
    var interpolateX = (0, d3_interpolate_1.interpolateNumber)(from.x, to.x);
    var interpolateY = (0, d3_interpolate_1.interpolateNumber)(from.y, to.y);
    var interpolateWidth = (0, d3_interpolate_1.interpolateNumber)(from.width, to.width);
    var interpolateHeight = (0, d3_interpolate_1.interpolateNumber)(from.height, to.height);
    return function (t) {
        return {
            x: interpolateX(t),
            y: interpolateY(t),
            width: interpolateWidth(t),
            height: interpolateHeight(t),
        };
    };
}
/**
 * Animates a bar from the start of the axis (x-axis for vertical layout, y-axis for horizontal layout) to its
 * final position.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
function useAnimateBar(props) {
    var initialProps = {
        x: props.layout === 'vertical' ? props.x : props.xOrigin,
        y: props.layout === 'vertical' ? props.yOrigin : props.y,
        width: props.layout === 'vertical' ? props.width : 0,
        height: props.layout === 'vertical' ? 0 : props.height,
    };
    return (0, useAnimate_1.useAnimate)({
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
    }, {
        createInterpolator: barPropsInterpolator,
        applyProps: function (element, animatedProps) {
            element.setAttribute('x', animatedProps.x.toString());
            element.setAttribute('y', animatedProps.y.toString());
            element.setAttribute('width', animatedProps.width.toString());
            element.setAttribute('height', animatedProps.height.toString());
        },
        transformProps: function (p) { return p; },
        initialProps: initialProps,
        skip: props.skipAnimation,
        ref: props.ref,
    });
}
