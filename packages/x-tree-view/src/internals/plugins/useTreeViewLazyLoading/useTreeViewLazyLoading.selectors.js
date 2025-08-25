"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorGetTreeItemError = exports.selectorIsItemLoading = exports.selectorIsLazyLoadingEnabled = exports.selectorDataSourceState = void 0;
var selectors_1 = require("../../utils/selectors");
var selectorLazyLoading = function (state) {
    return state.lazyLoading;
};
var selectorLazyLoadingOptional = function (state) { return state.lazyLoading; };
exports.selectorDataSourceState = (0, selectors_1.createSelector)([selectorLazyLoading], function (lazyLoading) { return lazyLoading.dataSource; });
/**
 * Check if lazy loading is enabled.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @returns {boolean} True if lazy loading is enabled, false if it isn't.
 */
exports.selectorIsLazyLoadingEnabled = (0, selectors_1.createSelector)([selectorLazyLoadingOptional], function (lazyLoading) { return !!(lazyLoading === null || lazyLoading === void 0 ? void 0 : lazyLoading.enabled); });
/**
 * Get the loading state for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the loading state of.
 * @returns {boolean} The loading state for the Tree Item.
 */
exports.selectorIsItemLoading = (0, selectors_1.createSelector)([exports.selectorDataSourceState, function (_, itemId) { return itemId; }], function (dataSourceState, itemId) { return dataSourceState.loading[itemId] || false; });
/**
 * Get the error for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the error for.
 * @returns {boolean} The error for the Tree Item.
 */
exports.selectorGetTreeItemError = (0, selectors_1.createSelector)([exports.selectorDataSourceState, function (_, itemId) { return itemId; }], function (dataSourceState, itemId) { return dataSourceState.errors[itemId] || null; });
