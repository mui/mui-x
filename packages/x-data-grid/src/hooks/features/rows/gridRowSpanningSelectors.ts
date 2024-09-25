import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

const gridRowSpanningStateSelector = (state: GridStateCommunity) => state.rowSpanning;

export const gridRowSpanningHiddenCellsSelector = createSelector(
  gridRowSpanningStateSelector,
  (rowSpanning) => rowSpanning.hiddenCells,
);

export const gridRowSpanningSpannedCellsSelector = createSelector(
  gridRowSpanningStateSelector,
  (rowSpanning) => rowSpanning.spannedCells,
);

export const gridRowSpanningHiddenCellsOriginMapSelector = createSelector(
  gridRowSpanningStateSelector,
  (rowSpanning) => rowSpanning.hiddenCellOriginMap,
);
