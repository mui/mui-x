"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = useStore;
/* We need to import the shim because React 17 does not support the `useSyncExternalStore` API.
 * More info: https://github.com/mui/mui-x/issues/18303#issuecomment-2958392341 */
var with_selector_1 = require("use-sync-external-store/shim/with-selector");
function useStore(store, selector, a1, a2, a3) {
    var selectorWithArgs = function (state) { return selector(state, a1, a2, a3); };
    return (0, with_selector_1.useSyncExternalStoreWithSelector)(store.subscribe, store.getSnapshot, store.getSnapshot, selectorWithArgs);
}
