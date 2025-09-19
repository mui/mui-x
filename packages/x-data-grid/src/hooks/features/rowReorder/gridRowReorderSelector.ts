import { createRootSelector, createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import type { GridRowId } from '../../../models/gridRows';

export const gridRowReorderStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.rowReorder,
);

export const gridIsRowDragActiveSelector = createSelector(
  gridRowReorderStateSelector,
  (rowReorder) => rowReorder?.isActive ?? false,
);

// Selector for the entire drop target state
export const gridRowDropTargetSelector = createSelector(
  gridRowReorderStateSelector,
  (rowReorder) => rowReorder?.dropTarget ?? { rowId: null, position: null },
);

export const gridRowDropTargetRowIdSelector = createSelector(
  gridRowDropTargetSelector,
  (dropTarget) => dropTarget.rowId ?? null,
);

// Selector for a specific row's drop position
export const gridRowDropPositionSelector = createSelector(
  gridRowDropTargetSelector,
  (dropTarget, rowId: GridRowId) => {
    if (dropTarget.rowId === rowId) {
      return dropTarget.position;
    }
    return null;
  },
);

// Selector for the dragged row ID
export const gridDraggedRowIdSelector = createSelector(
  gridRowReorderStateSelector,
  (rowReorder) => rowReorder?.draggedRowId ?? null,
);
