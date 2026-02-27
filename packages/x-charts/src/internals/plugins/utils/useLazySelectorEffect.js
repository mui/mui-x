"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLazySelectorEffect = useLazySelectorEffect;
/* eslint-disable react-compiler/react-compiler */
var React = require("react");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var noop = function () { };
function useLazySelectorEffect(store, selector, effect, 
/**
 * If true, the selector will be ignored.
 */
skip) {
    var instance = (0, useLazyRef_1.default)(initialize, {
        store: store,
        selector: selector,
        skip: skip,
    }).current;
    instance.effect = effect;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(instance.onMount(skip), [skip]);
}
// `useLazyRef` typings are incorrect, `params` should not be optional
function initialize(params) {
    var _a = params, store = _a.store, selector = _a.selector, initialSkip = _a.skip;
    var isRunning = false;
    var previousState;
    // We want a single subscription done right away and cleared on unmount only,
    // but React triggers `useOnMount` multiple times in dev, so we need to manage
    // the subscription anyway.
    var subscribe = function () {
        var _a;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        (_a = instance.dispose) !== null && _a !== void 0 ? _a : (instance.dispose = store.subscribe(function (state) {
            var nextState = selector(state);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            instance.effect(previousState, nextState);
            previousState = nextState;
        }));
    };
    var instance = {
        effect: noop,
        dispose: null,
        onMount: function (skip) { return function () {
            if (skip) {
                return undefined;
            }
            if (!isRunning) {
                // Initialize values
                isRunning = true;
                previousState = selector(store.state);
            }
            subscribe();
            return function () {
                var _a;
                (_a = instance.dispose) === null || _a === void 0 ? void 0 : _a.call(instance);
                instance.dispose = null;
            };
        }; },
    };
    if (!initialSkip) {
        // Initialize values
        isRunning = true;
        previousState = selector(store.state);
        subscribe();
    }
    return instance;
}
