import { createRootSelector } from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridRowsMetaSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowsMeta,
);
