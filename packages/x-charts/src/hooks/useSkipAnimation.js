"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkipAnimation = useSkipAnimation;
var useChartAnimation_1 = require("../internals/plugins/corePlugins/useChartAnimation");
var useStore_1 = require("../internals/store/useStore");
/**
 * A hook to get if chart animations should be skipped.
 *
 * @returns {boolean} whether to skip animations
 */
function useSkipAnimation(skipAnimation) {
    var store = (0, useStore_1.useStore)();
    var storeSkipAnimation = store.use(useChartAnimation_1.selectorChartSkipAnimation);
    return skipAnimation || storeSkipAnimation;
}
