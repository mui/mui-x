"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemHighlightState = useItemHighlightState;
var useStore_1 = require("../internals/store/useStore");
var useChartHighlight_1 = require("../internals/plugins/featurePlugins/useChartHighlight");
/**
 * A hook to check the highlighted state of the item.
 * This function already calculates that an item is not faded if it is highlighted.
 *
 * If you need fine control over the state, use the `useItemHighlightStateGetter` hook instead.
 *
 * @param {HighlightItemIdentifierWithType<SeriesType> | null} item is the item to check
 * @returns {HighlightState} the state of the item
 */
function useItemHighlightState(item) {
    var store = (0, useStore_1.useStore)();
    return store.use(useChartHighlight_1.selectorChartsHighlightState, item);
}
