"use strict";
'use client';
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
exports.useAnimate = useAnimate;
var useForkRef_1 = require("@mui/utils/useForkRef");
var useAnimateInternal_1 = require("../../internals/animation/useAnimateInternal");
/**
 * Hook to customize the animation of an element.
 * Animates a ref from `initialProps` to `props`.
 *
 * @param {object} props The props to animate to.
 *
 * @returns an object containing a ref that should be passed to the element to animate and the transformed props.
 * If `skip` is true, the transformed props are the `props` to animate to; if it is false, the transformed props are the
 * `initialProps`.
 *
 * The animated props are only accessible in `applyProps`. The props returned from this hook are not animated.
 *
 * When an animation starts, an interpolator is created using `createInterpolator`.
 * On every animation frame:
 * 1. The interpolator is called to get the interpolated props;
 * 2. `transformProps` is called to transform the interpolated props;
 * 3. `applyProps` is called to apply the transformed props to the element.
 *
 * If `props` change while an animation is progress, the animation will continue towards the new `props`.
 *
 * The animation can be skipped by setting `skip` to true. If a transition is in progress, it will immediately end
 * and `applyProps` be called with the final value. If there isn't a transition in progress, a new one won't be
 * started and `applyProps` will not be called.
 * */
function useAnimate(props, _a) {
    var createInterpolator = _a.createInterpolator, transformProps = _a.transformProps, applyProps = _a.applyProps, skip = _a.skip, _b = _a.initialProps, initialProps = _b === void 0 ? props : _b, ref = _a.ref;
    var transform = transformProps !== null && transformProps !== void 0 ? transformProps : (function (p) { return p; });
    var _c = (0, useAnimateInternal_1.useAnimateInternal)(props, {
        initialProps: initialProps,
        createInterpolator: createInterpolator,
        applyProps: function (element, animatedProps) { return applyProps(element, transform(animatedProps)); },
        skip: skip,
    }), animateRef = _c[0], lastInterpolatedProps = _c[1];
    var usedProps = skip ? transformProps(props) : transformProps(lastInterpolatedProps);
    return __assign(__assign({}, usedProps), { ref: (0, useForkRef_1.default)(animateRef, ref) });
}
