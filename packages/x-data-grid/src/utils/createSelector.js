"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRootSelector = exports.createSelectorMemoized = exports.createSelector = void 0;
var store_1 = require("@mui/x-internals/store");
exports.createSelector = (function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var baseSelector = store_1.createSelector.apply(void 0, args);
    var selector = function (apiRef, a1, a2, a3) {
        return baseSelector(unwrapIfNeeded(apiRef), a1, a2, a3);
    };
    return selector;
});
exports.createSelectorMemoized = (function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var baseSelector = store_1.createSelectorMemoized.apply(void 0, args);
    var selector = function (apiRef, a1, a2, a3) {
        return baseSelector(unwrapIfNeeded(apiRef), a1, a2, a3);
    };
    return selector;
});
/**
 * Used to create the root selector for a feature. It assumes that the state is already initialized
 * and strips from the types the possibility of `apiRef` being `null`.
 * Users are warned about this in our documentation https://mui.com/x/react-data-grid/state/#direct-selector-access
 */
var createRootSelector = function (fn) {
    return function (apiRef, args) {
        return fn(unwrapIfNeeded(apiRef), args);
    };
};
exports.createRootSelector = createRootSelector;
function unwrapIfNeeded(refOrState) {
    if ('current' in refOrState) {
        return refOrState.current.state;
    }
    return refOrState;
}
