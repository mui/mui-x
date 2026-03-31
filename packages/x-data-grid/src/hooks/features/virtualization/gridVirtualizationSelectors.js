import { createRootSelector, createSelector, createSelectorMemoized, } from '../../../utils/createSelector';
/**
 * Get the columns state
 * @category Virtualization
 */
export const gridVirtualizationSelector = createRootSelector((state) => state.virtualization);
/**
 * Get the enabled state for virtualization
 * @category Virtualization
 * @deprecated Use `gridVirtualizationColumnEnabledSelector` and `gridVirtualizationRowEnabledSelector`
 */
export const gridVirtualizationEnabledSelector = createSelector(gridVirtualizationSelector, (state) => state.enabled);
/**
 * Get the enabled state for column virtualization
 * @category Virtualization
 */
export const gridVirtualizationColumnEnabledSelector = createSelector(gridVirtualizationSelector, (state) => state.enabledForColumns);
/**
 * Get the enabled state for row virtualization
 * @category Virtualization
 */
export const gridVirtualizationRowEnabledSelector = createSelector(gridVirtualizationSelector, (state) => state.enabledForRows);
/**
 * Get the render context
 * @category Virtualization
 * @ignore - do not document.
 */
export const gridRenderContextSelector = createSelector(gridVirtualizationSelector, (state) => state.renderContext);
const firstColumnIndexSelector = createRootSelector((state) => state.virtualization.renderContext.firstColumnIndex);
const lastColumnIndexSelector = createRootSelector((state) => state.virtualization.renderContext.lastColumnIndex);
/**
 * Get the render context, with only columns filled in.
 * This is cached, so it can be used to only re-render when the column interval changes.
 * @category Virtualization
 * @ignore - do not document.
 */
export const gridRenderContextColumnsSelector = createSelectorMemoized(firstColumnIndexSelector, lastColumnIndexSelector, (firstColumnIndex, lastColumnIndex) => ({
    firstColumnIndex,
    lastColumnIndex,
}));
