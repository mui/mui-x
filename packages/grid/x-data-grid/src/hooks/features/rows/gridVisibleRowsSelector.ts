import { createSelector } from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';

/**
 * @category Visible rows
 * @ignore - do not document.
 */
export const gridVisibleRowsStateSelector = (state: GridStateCommunity) => state.visibleRows;

/**
 * @category Visible rows
 * @ignore - do not document.
 */
export const gridVisibleRowsLookupSelector = createSelector(
  gridVisibleRowsStateSelector,
  (visibleRowsState) => visibleRowsState.lookup,
);
