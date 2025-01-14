import { createSelector } from '../../../utils/createSelector';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

const gridRowSpanningStateSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.rowSpanning;

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
