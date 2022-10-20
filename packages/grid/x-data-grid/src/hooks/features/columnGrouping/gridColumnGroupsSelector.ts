import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
export const gridColumnGroupingSelector = (state: GridStateCommunity) => state.columnGrouping;

export const gridColumnGroupsUnwrappedModelSelector = createSelector(
  gridColumnGroupingSelector,
  (columnGrouping) => columnGrouping?.unwrappedGroupingModel ?? {},
);

export const gridColumnGroupsLookupSelector = createSelector(
  gridColumnGroupingSelector,
  (columnGrouping) => columnGrouping?.lookup ?? {},
);

export const gridColumnGroupsHeaderStructureSelector = createSelector(
  gridColumnGroupingSelector,
  (columnGrouping) => columnGrouping?.headerStructure ?? [],
);

export const gridColumnGroupsHeaderMaxDepthSelector = createSelector(
  gridColumnGroupingSelector,
  (columnGrouping) => columnGrouping?.maxDepth ?? 0,
);

const getGroupingHeader = (state: GridStateCommunity) => ({
  columnGrouping: state.columnGrouping,
  density: state.density,
});

export const gridTotalHeaderHeightSelector = createSelector(
  getGroupingHeader,
  ({ columnGrouping, density }) => density.headerHeight * ((columnGrouping?.maxDepth ?? 0) + 1),
);
