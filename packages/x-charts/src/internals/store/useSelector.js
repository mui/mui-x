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
exports.useSelector = void 0;
/* We need to import the shim because React 17 does not support the `useSyncExternalStore` API.
 * More info: https://github.com/mui/mui-x/issues/18303#issuecomment-2958392341 */
var with_selector_1 = require("use-sync-external-store/shim/with-selector");
var defaultCompare = Object.is;
var useSelector = function (store, selector, args, equals) {
    if (args === void 0) { args = []; }
    if (equals === void 0) { equals = defaultCompare; }
    var selectorWithArgs = function (state) {
        return selector.apply(void 0, __spreadArray([state], args, false));
    };
    return (0, with_selector_1.useSyncExternalStoreWithSelector)(store.subscribe, store.getSnapshot, store.getSnapshot, selectorWithArgs, equals);
};
exports.useSelector = useSelector;
