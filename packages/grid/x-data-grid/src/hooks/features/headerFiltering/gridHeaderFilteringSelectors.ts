/* eslint-disable @typescript-eslint/naming-convention */
import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const unstable_gridHeaderFilteringStateSelector = (state: GridStateCommunity) =>
  state.headerFiltering;

export const unstable_gridHeaderFilteringEditFieldSelector = createSelector(
  unstable_gridHeaderFilteringStateSelector,
  (headerFilteringState) => headerFilteringState.editing,
);

export const unstable_gridHeaderFilteringMenuSelector = createSelector(
  unstable_gridHeaderFilteringStateSelector,
  (headerFilteringState) => headerFilteringState.menuOpen,
);
