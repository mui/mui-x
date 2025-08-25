"use strict";
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
 * Method wrapping reselect's createSelector to provide caching for tree view instances.
 *
 */
exports.createSelector = (function () {
    var createSelectorArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        createSelectorArgs[_i] = arguments[_i];
    }
    var selector = function (state, selectorArgs) {
        var cacheKey = state.cacheKey;
        // If there is no cache for the current tree view instance, create one.
        var cacheForCurrentTreeViewInstance = cache.get(cacheKey);
        if (!cacheForCurrentTreeViewInstance) {
            cacheForCurrentTreeViewInstance = new Map();
            cache.set(cacheKey, cacheForCurrentTreeViewInstance);
        }
        // If there is a cached selector, execute it.
        var cachedSelector = cacheForCurrentTreeViewInstance.get(createSelectorArgs);
        if (cachedSelector) {
            return cachedSelector(state, selectorArgs);
        }
        // Otherwise, create a new selector and cache it and execute it.
        var fn = reselectCreateSelector.apply(void 0, createSelectorArgs);
        cacheForCurrentTreeViewInstance.set(createSelectorArgs, fn);
        return fn(state, selectorArgs);
    };
    return selector;
});
