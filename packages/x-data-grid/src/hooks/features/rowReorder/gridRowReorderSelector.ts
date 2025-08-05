import { createRootSelector, createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridRowReorderStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowReorder,
);

export const gridIsRowDragActiveSelector = createSelector(
  gridRowReorderStateSelector,
  (rowReorder) => rowReorder?.isActive ?? false,
);
