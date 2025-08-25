"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridRenderContextColumnsSelector = exports.gridRenderContextSelector = exports.gridVirtualizationRowEnabledSelector = exports.gridVirtualizationColumnEnabledSelector = exports.gridVirtualizationEnabledSelector = exports.gridVirtualizationSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
/**
 * Get the columns state
 * @category Virtualization
 */
exports.gridVirtualizationSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.virtualization; });
/**
 * Get the enabled state for virtualization
 * @category Virtualization
 * @deprecated Use `gridVirtualizationColumnEnabledSelector` and `gridVirtualizationRowEnabledSelector`
 */
exports.gridVirtualizationEnabledSelector = (0, createSelector_1.createSelector)(exports.gridVirtualizationSelector, function (state) { return state.enabled; });
/**
 * Get the enabled state for column virtualization
 * @category Virtualization
 */
exports.gridVirtualizationColumnEnabledSelector = (0, createSelector_1.createSelector)(exports.gridVirtualizationSelector, function (state) { return state.enabledForColumns; });
/**
 * Get the enabled state for row virtualization
 * @category Virtualization
 */
exports.gridVirtualizationRowEnabledSelector = (0, createSelector_1.createSelector)(exports.gridVirtualizationSelector, function (state) { return state.enabledForRows; });
/**
 * Get the render context
 * @category Virtualization
 * @ignore - do not document.
 */
exports.gridRenderContextSelector = (0, createSelector_1.createSelector)(exports.gridVirtualizationSelector, function (state) { return state.renderContext; });
var firstColumnIndexSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.virtualization.renderContext.firstColumnIndex; });
var lastColumnIndexSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.virtualization.renderContext.lastColumnIndex; });
/**
 * Get the render context, with only columns filled in.
 * This is cached, so it can be used to only re-render when the column interval changes.
 * @category Virtualization
 * @ignore - do not document.
 */
exports.gridRenderContextColumnsSelector = (0, createSelector_1.createSelectorMemoized)(firstColumnIndexSelector, lastColumnIndexSelector, function (firstColumnIndex, lastColumnIndex) { return ({
    firstColumnIndex: firstColumnIndex,
    lastColumnIndex: lastColumnIndex,
}); });
