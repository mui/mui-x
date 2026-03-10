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
exports.useChartAnimation = void 0;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useChartAnimation = function (_a) {
    var params = _a.params, store = _a.store;
    React.useEffect(function () {
        store.set('animation', __assign(__assign({}, store.state.animation), { skip: params.skipAnimation }));
    }, [store, params.skipAnimation]);
    var disableAnimation = React.useCallback(function () {
        var disableCalled = false;
        store.set('animation', __assign(__assign({}, store.state.animation), { skipAnimationRequests: store.state.animation.skipAnimationRequests + 1 }));
        return function () {
            if (disableCalled) {
                return;
            }
            disableCalled = true;
            store.set('animation', __assign(__assign({}, store.state.animation), { skipAnimationRequests: store.state.animation.skipAnimationRequests - 1 }));
        };
    }, [store]);
    (0, useEnhancedEffect_1.default)(function () {
        // Skip animation test/jsdom
        var isAnimationDisabledEnvironment = typeof window === 'undefined' || !(window === null || window === void 0 ? void 0 : window.matchMedia);
        if (isAnimationDisabledEnvironment) {
            return undefined;
        }
        var disableAnimationCleanup;
        var handleMediaChange = function (event) {
            if (event.matches) {
                disableAnimationCleanup = disableAnimation();
            }
            else {
                disableAnimationCleanup === null || disableAnimationCleanup === void 0 ? void 0 : disableAnimationCleanup();
            }
        };
        var mql = window.matchMedia('(prefers-reduced-motion)');
        handleMediaChange(mql);
        mql.addEventListener('change', handleMediaChange);
        return function () {
            mql.removeEventListener('change', handleMediaChange);
        };
    }, [disableAnimation, store]);
    return { instance: { disableAnimation: disableAnimation } };
};
exports.useChartAnimation = useChartAnimation;
exports.useChartAnimation.params = {
    skipAnimation: true,
};
exports.useChartAnimation.getDefaultizedParams = function (_a) {
    var _b;
    var params = _a.params;
    return (__assign(__assign({}, params), { skipAnimation: (_b = params.skipAnimation) !== null && _b !== void 0 ? _b : false }));
};
exports.useChartAnimation.getInitialState = function (_a) {
    var skipAnimation = _a.skipAnimation;
    var isAnimationDisabledEnvironment = typeof window === 'undefined' || !(window === null || window === void 0 ? void 0 : window.matchMedia);
    // We use the value of `isAnimationDisabledEnvironment` as the initial value of `skipAnimation` to avoid
    // re-rendering the component on environments where matchMedia is not supported, hence skipAnimation will always be true.
    var disableAnimations = process.env.NODE_ENV === 'test' ? isAnimationDisabledEnvironment : false;
    return {
        animation: {
            skip: skipAnimation,
            // By initializing the skipAnimationRequests to 1, we ensure that the animation is always skipped
            skipAnimationRequests: disableAnimations ? 1 : 0,
        },
    };
};
