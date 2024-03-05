import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridHeaderFilteringStateSelector = (state: GridStateCommunity) =>
  state.headerFiltering;

export const gridHeaderFilteringEnabledSelector = createSelector(
  gridHeaderFilteringStateSelector,
  (headerFilteringState) => headerFilteringState.enabled,
);

export const gridHeaderFilteringEditFieldSelector = createSelector(
  gridHeaderFilteringStateSelector,
  (headerFilteringState) => headerFilteringState.editing,
);

export const gridHeaderFilteringMenuSelector = createSelector(
  gridHeaderFilteringStateSelector,
  (headerFilteringState) => headerFilteringState.menuOpen,
);
