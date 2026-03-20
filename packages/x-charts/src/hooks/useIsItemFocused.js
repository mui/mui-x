"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsItemFocused = useIsItemFocused;
var useStore_1 = require("../internals/store/useStore");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
/**
 * A hook to check if an item has the focus.
 *
 * If you need to process multiple points, use the `useIsItemFocusedGetter` hook instead.
 *
 * @param {FocusedItemIdentifier} item is the item to check
 * @returns {boolean} the focus state
 */
function useIsItemFocused(item) {
    var store = (0, useStore_1.useStore)();
    return store.use(useChartKeyboardNavigation_1.selectorChartsItemIsFocused, item);
}
