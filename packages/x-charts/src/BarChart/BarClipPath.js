"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimateBarClipPath = useAnimateBarClipPath;
exports.BarClipPath = BarClipPath;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
var animation_1 = require("../hooks/animation");
function barClipPathPropsInterpolator(from, to) {
    var interpolateX = (0, d3_interpolate_1.interpolateNumber)(from.x, to.x);
    var interpolateY = (0, d3_interpolate_1.interpolateNumber)(from.y, to.y);
    var interpolateWidth = (0, d3_interpolate_1.interpolateNumber)(from.width, to.width);
    var interpolateHeight = (0, d3_interpolate_1.interpolateNumber)(from.height, to.height);
    var interpolateBorderRadius = (0, d3_interpolate_1.interpolateNumber)(from.borderRadius, to.borderRadius);
    return function (t) {
        return {
            x: interpolateX(t),
            y: interpolateY(t),
            width: interpolateWidth(t),
            height: interpolateHeight(t),
            borderRadius: interpolateBorderRadius(t),
        };
    };
}
function useAnimateBarClipPath(props) {
    var initialProps = {
        x: props.layout === 'vertical' ? props.x : props.xOrigin,
        y: props.layout === 'vertical' ? props.yOrigin : props.y,
        width: props.layout === 'vertical' ? props.width : 0,
        height: props.layout === 'vertical' ? 0 : props.height,
        borderRadius: props.borderRadius,
    };
    return (0, animation_1.useAnimate)({
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
    }, {
        createInterpolator: barClipPathPropsInterpolator,
        transformProps: function (p) { return ({
            d: generateClipPath(props.hasNegative, props.hasPositive, props.layout, p.x, p.y, p.width, p.height, props.xOrigin, props.yOrigin, p.borderRadius),
        }); },
        applyProps: function (element, _a) {
            var d = _a.d;
            if (d) {
                element.setAttribute('d', d);
            }
        },
        initialProps: initialProps,
        skip: props.skipAnimation,
        ref: props.ref,
    });
}
/**
 * @ignore - internal component.
 */
function BarClipPath(props) {
    var _a, _b;
    var maskId = props.maskId, x = props.x, y = props.y, width = props.width, height = props.height, skipAnimation = props.skipAnimation;
    var _c = useAnimateBarClipPath({
        layout: (_a = props.layout) !== null && _a !== void 0 ? _a : 'vertical',
        hasNegative: props.hasNegative,
        hasPositive: props.hasPositive,
        xOrigin: props.xOrigin,
        yOrigin: props.yOrigin,
        x: x,
        y: y,
        width: width,
        height: height,
        borderRadius: (_b = props.borderRadius) !== null && _b !== void 0 ? _b : 0,
        skipAnimation: skipAnimation,
    }), ref = _c.ref, d = _c.d;
    if (!props.borderRadius || props.borderRadius <= 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("clipPath", { id: maskId, children: (0, jsx_runtime_1.jsx)("path", { ref: ref, d: d }) }));
}
function generateClipPath(hasNegative, hasPositive, layout, x, y, width, height, xOrigin, yOrigin, borderRadius) {
    if (layout === 'vertical') {
        if (hasPositive && hasNegative) {
            var bR_1 = Math.min(borderRadius, width / 2, height / 2);
            return "M".concat(x, ",").concat(y + height / 2, " v").concat(-(height / 2 - bR_1), " a").concat(bR_1, ",").concat(bR_1, " 0 0 1 ").concat(bR_1, ",").concat(-bR_1, " h").concat(width - bR_1 * 2, " a").concat(bR_1, ",").concat(bR_1, " 0 0 1 ").concat(bR_1, ",").concat(bR_1, " v").concat(height - 2 * bR_1, " a").concat(bR_1, ",").concat(bR_1, " 0 0 1 ").concat(-bR_1, ",").concat(bR_1, " h").concat(-(width - bR_1 * 2), " a").concat(bR_1, ",").concat(bR_1, " 0 0 1 ").concat(-bR_1, ",").concat(-bR_1, " v").concat(-(height / 2 - bR_1));
        }
        var bR = Math.min(borderRadius, width / 2);
        if (hasPositive) {
            return "M".concat(x, ",").concat(Math.max(yOrigin, y + bR), " v").concat(Math.min(0, -(yOrigin - y - bR)), " a").concat(bR, ",").concat(bR, " 0 0 1 ").concat(bR, ",").concat(-bR, " h").concat(width - bR * 2, " a").concat(bR, ",").concat(bR, " 0 0 1 ").concat(bR, ",").concat(bR, " v").concat(Math.max(0, yOrigin - y - bR), " Z");
        }
        if (hasNegative) {
            return "M".concat(x, ",").concat(Math.min(yOrigin, y + height - bR), " v").concat(Math.max(0, height - bR), " a").concat(bR, ",").concat(bR, " 0 0 0 ").concat(bR, ",").concat(bR, " h").concat(width - bR * 2, " a").concat(bR, ",").concat(bR, " 0 0 0 ").concat(bR, ",").concat(-bR, " v").concat(-Math.max(0, height - bR), " Z");
        }
    }
    if (layout === 'horizontal') {
        if (hasPositive && hasNegative) {
            var bR_2 = Math.min(borderRadius, width / 2, height / 2);
            return "M".concat(x + width / 2, ",").concat(y, " h").concat(width / 2 - bR_2, " a").concat(bR_2, ",").concat(bR_2, " 0 0 1 ").concat(bR_2, ",").concat(bR_2, " v").concat(height - bR_2 * 2, " a").concat(bR_2, ",").concat(bR_2, " 0 0 1 ").concat(-bR_2, ",").concat(bR_2, " h").concat(-(width - 2 * bR_2), " a").concat(bR_2, ",").concat(bR_2, " 0 0 1 ").concat(-bR_2, ",").concat(-bR_2, " v").concat(-(height - bR_2 * 2), " a").concat(bR_2, ",").concat(bR_2, " 0 0 1 ").concat(bR_2, ",").concat(-bR_2, " h").concat(width / 2 - bR_2);
        }
        var bR = Math.min(borderRadius, height / 2);
        if (hasPositive) {
            return "M".concat(Math.min(xOrigin, x - bR), ",").concat(y, " h").concat(width, " a").concat(bR, ",").concat(bR, " 0 0 1 ").concat(bR, ",").concat(bR, " v").concat(height - bR * 2, " a").concat(bR, ",").concat(bR, " 0 0 1 ").concat(-bR, ",").concat(bR, " h").concat(-width, " Z");
        }
        if (hasNegative) {
            return "M".concat(Math.max(xOrigin, x + width + bR), ",").concat(y, " h").concat(-width, " a").concat(bR, ",").concat(bR, " 0 0 0 ").concat(-bR, ",").concat(bR, " v").concat(height - bR * 2, " a").concat(bR, ",").concat(bR, " 0 0 0 ").concat(bR, ",").concat(bR, " h").concat(width, " Z");
        }
    }
    return undefined;
}
