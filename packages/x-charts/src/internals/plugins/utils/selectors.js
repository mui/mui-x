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
exports.createSelector = void 0;
var reselect_1 = require("reselect");
var reselectCreateSelector = (0, reselect_1.createSelectorCreator)({
    memoize: reselect_1.lruMemoize,
    memoizeOptions: {
        maxSize: 1,
        equalityCheck: Object.is,
    },
});
var cache = new WeakMap();
/**
 * Method wrapping reselect's createSelector to provide caching for chart instances.
 *
 */
var createSelector = function () {
    var createSelectorArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        createSelectorArgs[_i] = arguments[_i];
    }
    var selector = function (state) {
        var selectorArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            selectorArgs[_i - 1] = arguments[_i];
        }
        var cacheKey = state.cacheKey;
        // If there is no cache for the current chart instance, create one.
        var cacheForCurrentChartInstance = cache.get(cacheKey);
        if (!cacheForCurrentChartInstance) {
            cacheForCurrentChartInstance = new Map();
            cache.set(cacheKey, cacheForCurrentChartInstance);
        }
        // If there is a cached selector, execute it.
        var cachedSelector = cacheForCurrentChartInstance.get(createSelectorArgs);
        if (cachedSelector) {
            return cachedSelector.apply(void 0, __spreadArray([state], selectorArgs, false));
        }
        // Otherwise, create a new selector and cache it and execute it.
        var fn = reselectCreateSelector.apply(void 0, createSelectorArgs);
        cacheForCurrentChartInstance.set(createSelectorArgs, fn);
        return fn.apply(void 0, __spreadArray([state], selectorArgs, false));
    };
    return selector;
};
exports.createSelector = createSelector;
