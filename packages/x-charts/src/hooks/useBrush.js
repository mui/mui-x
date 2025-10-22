"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBrush = useBrush;
var useChartBrush_1 = require("../internals/plugins/featurePlugins/useChartBrush");
var useSelector_1 = require("../internals/store/useSelector");
var useStore_1 = require("../internals/store/useStore");
/**
 * Get the current brush state.
 *
 * - `start` is the starting point of the brush selection.
 * - `current` is the current point of the brush selection.
 *
 * @returns `{ start, current }` - The brush state.
 */
function useBrush() {
    var store = (0, useStore_1.useStore)();
    return (0, useSelector_1.useSelector)(store, useChartBrush_1.selectorBrushState);
}
