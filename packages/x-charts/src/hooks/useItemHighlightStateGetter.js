"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemHighlightStateGetter = useItemHighlightStateGetter;
var useStore_1 = require("../internals/store/useStore");
var useChartHighlight_selectors_1 = require("../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.selectors");
/**
 * A hook to get a callback that returns the highlight state of an item.
 *
 * If you're interested by a single item, consider using `useItemHighlightState`.
 *
 * @returns {(item: HighlightItemIdentifierWithType | null) => HighlightState} callback to get the highlight state of an item.
 */
function useItemHighlightStateGetter() {
    var store = (0, useStore_1.useStore)();
    var getHighlightState = store.use(useChartHighlight_selectors_1.selectorChartsHighlightStateCallback);
    return getHighlightState;
}
