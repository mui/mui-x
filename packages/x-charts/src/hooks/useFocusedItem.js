"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFocusedItem = useFocusedItem;
var useStore_1 = require("../internals/store/useStore");
var useChartKeyboardNavigation_1 = require("../internals/plugins/featurePlugins/useChartKeyboardNavigation");
/**
 * Get the focused item from keyboard navigation.
 */
function useFocusedItem() {
    var store = (0, useStore_1.useStore)();
    return store.use(useChartKeyboardNavigation_1.selectorChartsFocusedItem);
}
