import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import type { GridColumnsRenderContext } from '../../../models/params/gridScrollParams';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';

/**
 * Get the columns state
 * @category Virtualization
 */
export const gridVirtualizationSelector = (state: GridStateCommunity) => state.virtualization;

/**
 * Get the enabled state for virtualization
 * @category Virtualization
 */
export const gridVirtualizationEnabledSelector = createSelector(
  gridVirtualizationSelector,
  (state) => state.enabled,
);

/**
 * Get the enabled state for virtualization
 * @category Virtualization
 */
export const gridVirtualizationColumnEnabledSelector = createSelector(
  gridVirtualizationSelector,
  (state) => state.enabledForColumns,
);

/**
 * Get the render context
 * @category Virtualization
 * @ignore - do not document.
 */
export const gridRenderContextSelector = createSelector(
  gridVirtualizationSelector,
  (state) => state.renderContext,
);

/**
 * Get the render context, with only columns filled in.
 * This is cached, so it can be used to only re-render when the column interval changes.
 * @category Virtualization
 * @ignore - do not document.
 */
export const gridRenderContextColumnsSelector = createSelectorMemoized(
  (state: GridStateCommunity) => state.virtualization.renderContext.firstColumnIndex,
  (state: GridStateCommunity) => state.virtualization.renderContext.lastColumnIndex,
  (firstColumnIndex, lastColumnIndex): GridColumnsRenderContext => ({
    firstColumnIndex,
    lastColumnIndex,
  }),
);
