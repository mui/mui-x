import type { GridStateCommunity } from '../../../models/gridStateCommunity';
import { createRootSelector } from '../../../utils/createSelector';

export const gridColumnMenuSelector = createRootSelector(
  (state: GridStateCommunity) => state.columnMenu,
);
