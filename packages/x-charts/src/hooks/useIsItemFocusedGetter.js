"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsItemFocusedGetter = useIsItemFocusedGetter;
var useFocusedItem_1 = require("./useFocusedItem");
/**
 * A hook to check focus state of multiple items.
 * If you're interested by a single one, consider using `useIsItemFocused`.
 *
 * @returns {(item: FocusedItemData) => boolean} callback to get the state of the item.
 */
function useIsItemFocusedGetter() {
    var focusedItem = (0, useFocusedItem_1.useFocusedItem)();
    return function (item) {
        return focusedItem !== null &&
            focusedItem.seriesType === item.seriesType &&
            focusedItem.seriesId === item.seriesId &&
            focusedItem.dataIndex === item.dataIndex;
    };
}
