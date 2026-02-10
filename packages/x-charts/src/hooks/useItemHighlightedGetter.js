"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemHighlightedGetter = useItemHighlightedGetter;
var useStore_1 = require("../internals/store/useStore");
var useChartHighlight_selectors_1 = require("../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.selectors");
/**
 * A hook to check the highlighted state of multiple items.
 * If you're interested by a single one, consider using `useItemHighlighted`.
 *
 * Warning: highlighted and faded can both be true at the same time.
 * We recommend to first test if item is highlighted: `const faded = !highlighted && isFaded(item)`
 * @returns {{ isHighlighted, isFaded }} callbacks to get the state of the item.
 */
function useItemHighlightedGetter() {
    var store = (0, useStore_1.useStore)();
    var isHighlighted = store.use(useChartHighlight_selectors_1.selectorChartsIsHighlightedCallback);
    var isFaded = store.use(useChartHighlight_selectors_1.selectorChartsIsFadedCallback);
    return {
        isHighlighted: isHighlighted,
        isFaded: isFaded,
    };
}
