import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
export const gridColumnGroupingSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.columnGrouping;

export const gridColumnGroupsUnwrappedModelSelector = createSelectorMemoized(
  gridColumnGroupingSelector,
  (columnGrouping) => columnGrouping?.unwrappedGroupingModel ?? {},
);

export const gridColumnGroupsLookupSelector = createSelectorMemoized(
  gridColumnGroupingSelector,
  (columnGrouping) => columnGrouping?.lookup ?? {},
);

export const gridColumnGroupsHeaderStructureSelector = createSelectorMemoized(
  gridColumnGroupingSelector,
  (columnGrouping) => columnGrouping?.headerStructure ?? [],
);

export const gridColumnGroupsHeaderMaxDepthSelector = createSelector(
  gridColumnGroupingSelector,
  (columnGrouping) => columnGrouping?.maxDepth ?? 0,
);
