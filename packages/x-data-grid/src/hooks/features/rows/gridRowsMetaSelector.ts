import { RowsMeta } from '@mui/x-virtualizer';
import { createRootSelector, createSelector } from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridRowsMetaSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowsMeta,
);

/**
 * Position of the row at `index` in the current page, or `undefined` out of range.
 */
export const gridRowPositionSelector = createSelector(
  gridRowsMetaSelector,
  (rowsMeta, index: number) => RowsMeta.getPosition(rowsMeta, index),
);
