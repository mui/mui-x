import { createRootSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridRowsMetaSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowsMeta,
);
