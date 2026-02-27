"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimateBarLabel = useAnimateBarLabel;
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var useAnimate_1 = require("./useAnimate");
function barLabelPropsInterpolator(from, to) {
    var interpolateX = (0, d3_interpolate_1.interpolateNumber)(from.x, to.x);
    var interpolateY = (0, d3_interpolate_1.interpolateNumber)(from.y, to.y);
    var interpolateWidth = (0, d3_interpolate_1.interpolateNumber)(from.width, to.width);
    var interpolateHeight = (0, d3_interpolate_1.interpolateNumber)(from.height, to.height);
    return function (t) { return ({
        x: interpolateX(t),
        y: interpolateY(t),
        width: interpolateWidth(t),
        height: interpolateHeight(t),
    }); };
}
/**
 * Animates a bar label from the start of the axis (x-axis for vertical layout, y-axis for horizontal layout) to the
 * center of the bar it belongs to.
 * The label is horizontally centered within the bar when the layout is vertical, and vertically centered for laid out
 * horizontally.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
function useAnimateBarLabel(props) {
    var _a = props.placement === 'outside' ? getOutsidePlacement(props) : getCenterPlacement(props), initialX = _a.initialX, currentX = _a.currentX, initialY = _a.initialY, currentY = _a.currentY;
    var initialProps = {
        x: initialX,
        y: initialY,
        width: props.width,
        height: props.height,
    };
    var currentProps = {
        x: currentX,
        y: currentY,
        width: props.width,
        height: props.height,
    };
    return (0, useAnimate_1.useAnimate)(currentProps, {
        createInterpolator: barLabelPropsInterpolator,
        transformProps: function (p) { return p; },
        applyProps: function (element, animatedProps) {
            element.setAttribute('x', animatedProps.x.toString());
            element.setAttribute('y', animatedProps.y.toString());
            element.setAttribute('width', animatedProps.width.toString());
            element.setAttribute('height', animatedProps.height.toString());
        },
        initialProps: initialProps,
        skip: props.skipAnimation,
        ref: props.ref,
    });
}
var LABEL_OFFSET = 4;
function getCenterPlacement(props) {
    return {
        initialX: props.layout === 'vertical' ? props.x + props.width / 2 : props.xOrigin,
        initialY: props.layout === 'vertical' ? props.yOrigin : props.y + props.height / 2,
        currentX: props.x + props.width / 2,
        currentY: props.y + props.height / 2,
    };
}
function getOutsidePlacement(props) {
    var initialY = 0;
    var currentY = 0;
    var initialX = 0;
    var currentX = 0;
    if (props.layout === 'vertical') {
        var shouldPlaceAbove = props.y < props.yOrigin;
        if (shouldPlaceAbove) {
            initialY = props.yOrigin - LABEL_OFFSET;
            currentY = props.y - LABEL_OFFSET;
        }
        else {
            initialY = props.yOrigin + LABEL_OFFSET;
            currentY = props.y + props.height + LABEL_OFFSET;
        }
        return {
            initialX: props.x + props.width / 2,
            currentX: props.x + props.width / 2,
            initialY: initialY,
            currentY: currentY,
        };
    }
    var shouldPlaceToTheLeft = props.x < props.xOrigin;
    if (shouldPlaceToTheLeft) {
        initialX = props.xOrigin;
        currentX = props.x - LABEL_OFFSET;
    }
    else {
        initialX = props.xOrigin;
        currentX = props.x + props.width + LABEL_OFFSET;
    }
    return {
        initialX: initialX,
        currentX: currentX,
        initialY: props.y + props.height / 2,
        currentY: props.y + props.height / 2,
    };
}
