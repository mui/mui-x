import { createSelector } from '../../../utils/createSelector';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const gridHeaderFilteringStateSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.headerFiltering;

export const gridHeaderFilteringEnabledSelector = createSelector(
  gridHeaderFilteringStateSelector,
  // No initialization in MIT, so we need to default to false to be used by `getTotalHeaderHeight`
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
