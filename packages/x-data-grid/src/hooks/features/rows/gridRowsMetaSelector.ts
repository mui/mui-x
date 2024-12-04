import { createSelector, createSelectorMemoized } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridRowsMetaSelector = (state: GridStateCommunity) => state.rowsMeta;

const gridTopPinnedRowsHeightSelector = createSelector(
  gridRowsMetaSelector,
  (rowsMeta) => rowsMeta.pinnedTopRowsTotalHeight ?? 0,
);

const gridBottomPinnnedRowsHeightSelector = createSelector(
  gridRowsMetaSelector,
  (rowsMeta) => rowsMeta.pinnedBottomRowsTotalHeight ?? 0,
);

export const gridPinnedRowsHeightSelector = createSelectorMemoized(
  gridTopPinnedRowsHeightSelector,
  gridBottomPinnnedRowsHeightSelector,
  (top, bottom) => ({
    top,
    bottom,
  }),
);
