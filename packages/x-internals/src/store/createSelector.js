"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelectorMemoized = exports.createSelectorMemoizedWithOptions = exports.createSelector = void 0;
var reselect_1 = require("reselect");
/* eslint-disable no-underscore-dangle */ // __cacheKey__
var reselectCreateSelector = (0, reselect_1.createSelectorCreator)({
    memoize: reselect_1.lruMemoize,
    memoizeOptions: {
        maxSize: 1,
        equalityCheck: Object.is,
    },
});
/* eslint-disable id-denylist */
exports.createSelector = (function (a, b, c, d, e, f, g, h) {
    var other = [];
    for (var _i = 8; _i < arguments.length; _i++) {
        other[_i - 8] = arguments[_i];
    }
    if (other.length > 0) {
        throw new Error('Unsupported number of selectors');
    }
    var selector;
    if (a && b && c && d && e && f && g && h) {
        selector = function (state, a1, a2, a3) {
            var va = a(state, a1, a2, a3);
            var vb = b(state, a1, a2, a3);
            var vc = c(state, a1, a2, a3);
            var vd = d(state, a1, a2, a3);
            var ve = e(state, a1, a2, a3);
            var vf = f(state, a1, a2, a3);
            var vg = g(state, a1, a2, a3);
            return h(va, vb, vc, vd, ve, vf, vg, a1, a2, a3);
        };
    }
    else if (a && b && c && d && e && f && g) {
        selector = function (state, a1, a2, a3) {
            var va = a(state, a1, a2, a3);
            var vb = b(state, a1, a2, a3);
            var vc = c(state, a1, a2, a3);
            var vd = d(state, a1, a2, a3);
            var ve = e(state, a1, a2, a3);
            var vf = f(state, a1, a2, a3);
            return g(va, vb, vc, vd, ve, vf, a1, a2, a3);
        };
    }
    else if (a && b && c && d && e && f) {
        selector = function (state, a1, a2, a3) {
            var va = a(state, a1, a2, a3);
            var vb = b(state, a1, a2, a3);
            var vc = c(state, a1, a2, a3);
            var vd = d(state, a1, a2, a3);
            var ve = e(state, a1, a2, a3);
            return f(va, vb, vc, vd, ve, a1, a2, a3);
        };
    }
    else if (a && b && c && d && e) {
        selector = function (state, a1, a2, a3) {
            var va = a(state, a1, a2, a3);
            var vb = b(state, a1, a2, a3);
            var vc = c(state, a1, a2, a3);
            var vd = d(state, a1, a2, a3);
            return e(va, vb, vc, vd, a1, a2, a3);
        };
    }
    else if (a && b && c && d) {
        selector = function (state, a1, a2, a3) {
            var va = a(state, a1, a2, a3);
            var vb = b(state, a1, a2, a3);
            var vc = c(state, a1, a2, a3);
            return d(va, vb, vc, a1, a2, a3);
        };
    }
    else if (a && b && c) {
        selector = function (state, a1, a2, a3) {
            var va = a(state, a1, a2, a3);
            var vb = b(state, a1, a2, a3);
            return c(va, vb, a1, a2, a3);
        };
    }
    else if (a && b) {
        selector = function (state, a1, a2, a3) {
            var va = a(state, a1, a2, a3);
            return b(va, a1, a2, a3);
        };
    }
    else if (a) {
        selector = a;
    }
    else {
        throw new Error('Missing arguments');
    }
    return selector;
});
/* eslint-enable id-denylist */
var createSelectorMemoizedWithOptions = function (options) {
    return function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        var cache = new WeakMap();
        var nextCacheId = 1;
        var combiner = inputs[inputs.length - 1];
        var nSelectors = inputs.length - 1 || 1;
        // (s1, s2, ..., sN, a1, a2, a3) => { ... }
        var argsLength = Math.max(combiner.length - nSelectors, 0);
        if (argsLength > 3) {
            throw new Error('Unsupported number of arguments');
        }
        // prettier-ignore
        var selector = function (state, a1, a2, a3) {
            var cacheKey = state.__cacheKey__;
            if (!cacheKey) {
                cacheKey = { id: nextCacheId };
                state.__cacheKey__ = cacheKey;
                nextCacheId += 1;
            }
            var fn = cache.get(cacheKey);
            if (!fn) {
                var selectors = inputs.length === 1 ? [(function (x) { return x; }), combiner] : inputs;
                var reselectArgs = inputs;
                var selectorArgs_1 = [undefined, undefined, undefined];
                switch (argsLength) {
                    case 0:
                        break;
                    case 1: {
                        reselectArgs = __spreadArray(__spreadArray([], selectors.slice(0, -1), true), [
                            function () { return selectorArgs_1[0]; },
                            combiner
                        ], false);
                        break;
                    }
                    case 2: {
                        reselectArgs = __spreadArray(__spreadArray([], selectors.slice(0, -1), true), [
                            function () { return selectorArgs_1[0]; },
                            function () { return selectorArgs_1[1]; },
                            combiner,
                        ], false);
                        break;
                    }
                    case 3: {
                        reselectArgs = __spreadArray(__spreadArray([], selectors.slice(0, -1), true), [
                            function () { return selectorArgs_1[0]; },
                            function () { return selectorArgs_1[1]; },
                            function () { return selectorArgs_1[2]; },
                            combiner,
                        ], false);
                        break;
                    }
                    default:
                        throw new Error('Unsupported number of arguments');
                }
                if (options) {
                    reselectArgs = __spreadArray(__spreadArray([], reselectArgs, true), [options], false);
                }
                fn = reselectCreateSelector.apply(void 0, reselectArgs);
                fn.selectorArgs = selectorArgs_1;
                cache.set(cacheKey, fn);
            }
            /* eslint-disable no-fallthrough */
            switch (argsLength) {
                case 3: fn.selectorArgs[2] = a3;
                case 2: fn.selectorArgs[1] = a2;
                case 1: fn.selectorArgs[0] = a1;
                case 0:
                default:
            }
            switch (argsLength) {
                case 0: return fn(state);
                case 1: return fn(state, a1);
                case 2: return fn(state, a1, a2);
                case 3: return fn(state, a1, a2, a3);
                default:
                    throw new Error('unreachable');
            }
        };
        return selector;
    };
};
exports.createSelectorMemoizedWithOptions = createSelectorMemoizedWithOptions;
exports.createSelectorMemoized = (0, exports.createSelectorMemoizedWithOptions)();
