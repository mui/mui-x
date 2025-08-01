import { createRootSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridRowReorderStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowReorder,
);

export const gridIsRowDragActiveSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowReorder.isActive,
);
