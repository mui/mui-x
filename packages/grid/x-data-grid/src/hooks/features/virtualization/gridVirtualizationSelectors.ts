import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { GridRenderContext } from '../../../models/params/gridScrollParams';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

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
 */
export const gridRenderContextSelector = createSelector(
  gridVirtualizationSelector,
  (state) => state.renderContext,
);

/**
 * Get the render context, with only columns filled in.
 * This is cached, so it can be used to only re-render when the column interval changes.
 * @category Virtualization
 */
export const gridRenderContextColumnsSelector = createSelectorMemoized(
  (state: GridStateCommunity) => gridRenderContextSelector(state).firstColumnIndex,
  (state: GridStateCommunity) => gridRenderContextSelector(state).lastColumnIndex,
  (firstColumnIndex, lastColumnIndex): GridRenderContext => ({
    firstRowIndex: -1,
    lastRowIndex: -1,
    firstColumnIndex,
    lastColumnIndex,
  }),
);
