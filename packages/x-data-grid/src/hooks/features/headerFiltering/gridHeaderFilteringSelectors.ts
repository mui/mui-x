import { createSelector, createRootSelector } from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridHeaderFilteringStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.headerFiltering,
);

export const gridHeaderFilteringEnabledSelector = createSelector(
  gridHeaderFilteringStateSelector,
  // The state is only initialized in Pro, so it is `undefined` on the MIT grid.
  (headerFilteringState) => headerFilteringState?.enabled ?? false,
);

export const gridHeaderFilteringEditFieldSelector = createSelector(
  gridHeaderFilteringStateSelector,
  (headerFilteringState) => headerFilteringState.editing,
);

export const gridHeaderFilteringMenuSelector = createSelector(
  gridHeaderFilteringStateSelector,
  (headerFilteringState) => headerFilteringState.menuOpen,
);
