"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStoreEffect = useStoreEffect;
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var useOnMount_1 = require("@mui/utils/useOnMount");
var noop = function () { };
/**
 * An Effect implementation for the Store. This should be used for side-effects only. To
 * compute and store derived state, use `createSelectorMemoized` instead.
 */
function useStoreEffect(store, selector, effect) {
    var instance = (0, useLazyRef_1.default)(initialize, { store: store, selector: selector }).current;
    instance.effect = effect;
    (0, useOnMount_1.default)(instance.onMount);
}
// `useLazyRef` typings are incorrect, `params` should not be optional
function initialize(params) {
    var _a = params, store = _a.store, selector = _a.selector;
    var previousState = selector(store.state);
    var instance = {
        effect: noop,
        dispose: null,
        // We want a single subscription done right away and cleared on unmount only,
        // but React triggers `useOnMount` multiple times in dev, so we need to manage
        // the subscription anyway.
        subscribe: function () {
            var _a;
            (_a = instance.dispose) !== null && _a !== void 0 ? _a : (instance.dispose = store.subscribe(function (state) {
                var nextState = selector(state);
                if (!Object.is(previousState, nextState)) {
                    var prev = previousState;
                    previousState = nextState;
                    instance.effect(prev, nextState);
                }
            }));
        },
        onMount: function () {
            instance.subscribe();
            return function () {
                var _a;
                (_a = instance.dispose) === null || _a === void 0 ? void 0 : _a.call(instance);
                instance.dispose = null;
            };
        },
    };
    instance.subscribe();
    return instance;
}
