"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsItemFocused = useIsItemFocused;
var useFocusedItem_1 = require("./useFocusedItem");
/**
 * A hook to check if an item has the focus.
 *
 * If you need to process multiple points, use the `useIsItemFocusedGetter` hook instead.
 *
 * @param {FocusedItemData} item is the item to check
 * @returns {boolean} the focus state
 */
function useIsItemFocused(item) {
    var focusedItem = (0, useFocusedItem_1.useFocusedItem)();
    return (focusedItem !== null &&
        focusedItem.seriesType === item.seriesType &&
        focusedItem.seriesId === item.seriesId &&
        focusedItem.dataIndex === item.dataIndex);
}
