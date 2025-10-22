"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimateInternal = useAnimateInternal;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var animation_1 = require("./animation");
var Transition_1 = require("./Transition");
var shallowEqual_1 = require("../shallowEqual");
/** Animates a ref. The animation can be skipped by setting {@link skip} to true.
 *
 * If possible, prefer {@link useAnimate}.
 *
 * - If {@link skip} is false, a transition will be started.
 * - If {@link skip} is true and no transition is in progress, no transition will be started and {@link applyProps} will
 *   never be called.
 * - If {@link skip} becomes true and a transition is in progress, the transition will immediately end and
 *   {@link applyProps} be called with the final value.
 * */
function useAnimateInternal(props, _a) {
    var createInterpolator = _a.createInterpolator, applyProps = _a.applyProps, skip = _a.skip, _b = _a.initialProps, initialProps = _b === void 0 ? props : _b;
    var lastInterpolatedPropsRef = React.useRef(initialProps);
    var transitionRef = React.useRef(null);
    var elementRef = React.useRef(null);
    var lastPropsRef = React.useRef(props);
    (0, useEnhancedEffect_1.default)(function () {
        lastPropsRef.current = props;
    }, [props]);
    (0, useEnhancedEffect_1.default)(function () {
        var _a;
        if (skip) {
            (_a = transitionRef.current) === null || _a === void 0 ? void 0 : _a.finish();
            transitionRef.current = null;
            elementRef.current = null;
            lastInterpolatedPropsRef.current = props;
        }
    }, [props, skip]);
    var animate = React.useCallback(function (element) {
        var lastInterpolatedProps = lastInterpolatedPropsRef.current;
        var interpolate = createInterpolator(lastInterpolatedProps, props);
        transitionRef.current = new Transition_1.Transition(animation_1.ANIMATION_DURATION_MS, animation_1.ANIMATION_TIMING_FUNCTION_JS, function (t) {
            var interpolatedProps = interpolate(t);
            lastInterpolatedPropsRef.current = interpolatedProps;
            applyProps(element, interpolatedProps);
        });
    }, [applyProps, createInterpolator, props]);
    var setRef = React.useCallback(function (element) {
        var _a, _b, _c, _d;
        if (element === null) {
            (_a = transitionRef.current) === null || _a === void 0 ? void 0 : _a.stop();
            return;
        }
        var lastElement = elementRef.current;
        if (lastElement === element) {
            // If it's the same element and same props, resume the transition.
            if ((0, shallowEqual_1.shallowEqual)(lastPropsRef.current, props)) {
                (_b = transitionRef.current) === null || _b === void 0 ? void 0 : _b.resume();
                return;
            }
            // If props aren't the same, stop the transition and start a new animation.
            (_c = transitionRef.current) === null || _c === void 0 ? void 0 : _c.stop();
        }
        // If it's a different element, stop the transition of the last element and start a new animation.
        if (lastElement) {
            (_d = transitionRef.current) === null || _d === void 0 ? void 0 : _d.stop();
        }
        elementRef.current = element;
        if (transitionRef.current || !skip) {
            animate(element);
        }
    }, [animate, props, skip]);
    return [setRef, lastInterpolatedPropsRef.current];
}
