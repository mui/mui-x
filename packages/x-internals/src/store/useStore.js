"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = useStore;
var React = require("react");
/* We need to import the shim because React 17 does not support the `useSyncExternalStore` API.
 * More info: https://github.com/mui/mui-x/issues/18303#issuecomment-2958392341 */
var shim_1 = require("use-sync-external-store/shim");
var with_selector_1 = require("use-sync-external-store/shim/with-selector");
var reactMajor_1 = require("../reactMajor");
/* Some tests fail in R18 with the raw useSyncExternalStore. It may be possible to make it work
 * but for now we only enable it for R19+. */
var canUseRawUseSyncExternalStore = reactMajor_1.default >= 19;
var useStoreImplementation = canUseRawUseSyncExternalStore ? useStoreR19 : useStoreLegacy;
function useStore(store, selector, a1, a2, a3) {
    return useStoreImplementation(store, selector, a1, a2, a3);
}
function useStoreR19(store, selector, a1, a2, a3) {
    var getSelection = React.useCallback(function () { return selector(store.getSnapshot(), a1, a2, a3); }, [store, selector, a1, a2, a3]);
    return (0, shim_1.useSyncExternalStore)(store.subscribe, getSelection, getSelection);
}
function useStoreLegacy(store, selector, a1, a2, a3) {
    return (0, with_selector_1.useSyncExternalStoreWithSelector)(store.subscribe, store.getSnapshot, store.getSnapshot, function (state) { return selector(state, a1, a2, a3); });
}
