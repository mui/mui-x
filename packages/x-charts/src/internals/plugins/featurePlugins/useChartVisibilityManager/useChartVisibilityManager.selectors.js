"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorIsItemVisibleGetter = exports.selectorVisibilityMap = exports.EMPTY_VISIBILITY_MAP = void 0;
var store_1 = require("@mui/x-internals/store");
var useChartSeriesConfig_1 = require("../../corePlugins/useChartSeriesConfig");
var serializeIdentifier_1 = require("../../corePlugins/useChartSeriesConfig/utils/serializeIdentifier");
/**
 * Selector to get the visibility manager state.
 */
var selectVisibilityManager = function (state) { return state.visibilityManager; };
exports.EMPTY_VISIBILITY_MAP = new Map();
/**
 * Selector to get the hidden identifiers from the visibility manager.
 */
exports.selectorVisibilityMap = (0, store_1.createSelector)(selectVisibilityManager, function (visibilityManager) { var _a; return (_a = visibilityManager === null || visibilityManager === void 0 ? void 0 : visibilityManager.visibilityMap) !== null && _a !== void 0 ? _a : exports.EMPTY_VISIBILITY_MAP; });
var selectorIsItemVisibleFn = function (visibilityMap, seriesConfig) {
    return function (identifier) {
        var uniqueId = (0, serializeIdentifier_1.serializeIdentifier)(seriesConfig, identifier);
        return !visibilityMap.has(uniqueId);
    };
};
/**
 * Selector that returns a function which returns whether an item is visible.
 */
exports.selectorIsItemVisibleGetter = (0, store_1.createSelectorMemoized)(exports.selectorVisibilityMap, useChartSeriesConfig_1.selectorChartSeriesConfig, selectorIsItemVisibleFn);
