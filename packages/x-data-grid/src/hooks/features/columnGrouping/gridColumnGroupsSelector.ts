import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
export const gridColumnGroupingSelector = (state: GridStateCommunity) => state.columnGrouping;

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
