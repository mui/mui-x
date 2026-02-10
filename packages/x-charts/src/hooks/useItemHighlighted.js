"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemHighlighted = useItemHighlighted;
var useStore_1 = require("../internals/store/useStore");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
/**
 * A hook to check the highlighted state of the item.
 * This function already calculates that an item is not faded if it is highlighted.
 *
 * If you need fine control over the state, use the `useItemHighlightedGetter` hook instead.
 *
 * @param {HighlightItemData | null} item is the item to check
 * @returns {UseItemHighlightedReturnType} the state of the item
 */
function useItemHighlighted(item) {
    var store = (0, useStore_1.useStore)();
    var isHighlighted = store.use(useChartHighlight_1.selectorChartsIsHighlighted, item);
    var isFaded = store.use(useChartHighlight_1.selectorChartsIsFaded, item);
    return { isHighlighted: isHighlighted, isFaded: !isHighlighted && isFaded };
}
