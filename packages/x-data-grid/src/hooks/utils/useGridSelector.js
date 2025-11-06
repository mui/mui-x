"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.argsEqual = exports.objectShallowCompare = void 0;
exports.useGridSelector = useGridSelector;
var React = require("react");
var fastObjectShallowCompare_1 = require("@mui/x-internals/fastObjectShallowCompare");
var warning_1 = require("@mui/x-internals/warning");
var shim_1 = require("use-sync-external-store/shim");
var useLazyRef_1 = require("./useLazyRef");
var defaultCompare = Object.is;
exports.objectShallowCompare = fastObjectShallowCompare_1.fastObjectShallowCompare;
var arrayShallowCompare = function (a, b) {
    if (a === b) {
        return true;
    }
    return a.length === b.length && a.every(function (v, i) { return v === b[i]; });
};
var argsEqual = function (prev, curr) {
    var fn = Object.is;
    if (curr instanceof Array) {
        fn = arrayShallowCompare;
    }
    else if (curr instanceof Object) {
        fn = exports.objectShallowCompare;
    }
    return fn(prev, curr);
};
exports.argsEqual = argsEqual;
var createRefs = function () { return ({ state: null, equals: null, selector: null, args: undefined }); };
var EMPTY = [];
var emptyGetSnapshot = function () { return null; };
function useGridSelector(apiRef, selector, args, equals) {
    if (args === void 0) { args = undefined; }
    if (equals === void 0) { equals = defaultCompare; }
    if (process.env.NODE_ENV !== 'production') {
        if (!apiRef.current.state) {
            (0, warning_1.warnOnce)([
                'MUI X: `useGridSelector` has been called before the initialization of the state.',
                'This hook can only be used inside the context of the grid.',
            ]);
        }
    }
    var refs = (0, useLazyRef_1.useLazyRef)(createRefs);
    var didInit = refs.current.selector !== null;
    var _a = React.useState(
    // We don't use an initialization function to avoid allocations
    (didInit ? null : selector(apiRef, args))), state = _a[0], setState = _a[1];
    refs.current.state = state;
    refs.current.equals = equals;
    refs.current.selector = selector;
    var prevArgs = refs.current.args;
    refs.current.args = args;
    if (didInit && !(0, exports.argsEqual)(prevArgs, args)) {
        var newState = refs.current.selector(apiRef, refs.current.args);
        if (!refs.current.equals(refs.current.state, newState)) {
            refs.current.state = newState;
            setState(newState);
        }
    }
    var subscribe = React.useCallback(function () {
        if (refs.current.subscription) {
            return null;
        }
        refs.current.subscription = apiRef.current.store.subscribe(function () {
            var newState = refs.current.selector(apiRef, refs.current.args);
            if (!refs.current.equals(refs.current.state, newState)) {
                refs.current.state = newState;
                setState(newState);
            }
        });
        return null;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    EMPTY);
    var unsubscribe = React.useCallback(function () {
        // Fixes issue in React Strict Mode, where getSnapshot is not called
        if (!refs.current.subscription) {
            subscribe();
        }
        return function () {
            if (refs.current.subscription) {
                refs.current.subscription();
                refs.current.subscription = undefined;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, EMPTY);
    (0, shim_1.useSyncExternalStore)(unsubscribe, subscribe, emptyGetSnapshot);
    return state;
}
