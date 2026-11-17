import { isObjectEmpty } from '@mui/x-internals/isObjectEmpty';
import { createRootSelector, createSelector } from '../../../utils/createSelector';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';
import type { GridRowId } from '../../../models/gridRows';
import { gridEditRowsStateSelector } from '../editing/gridEditingSelectors';
import {
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
} from '../focus/gridFocusStateSelector';
import { gridRowMaximumTreeDepthSelector } from '../rows/gridRowsSelector';
import { gridSortModelSelector } from '../sorting/gridSortingSelector';

const gridKeyboardReorderStateSelector = createRootSelector(
  (state: GridStateCommunity) => state.keyboardReorder,
);

// The state only exists when a plan initializes it
const gridKeyboardReorderShowTargetSelector = createSelector(
  gridKeyboardReorderStateSelector,
  gridEditRowsStateSelector,
  (keyboardReorder, editRows) => (keyboardReorder?.showTarget ?? false) && isObjectEmpty(editRows),
);

/**
 * Whether the row is marked, before the checks that depend on the row model.
 */
export const gridRowKeyboardReorderTargetSelector = createSelector(
  gridKeyboardReorderShowTargetSelector,
  gridFocusCellSelector,
  gridSortModelSelector,
  gridRowMaximumTreeDepthSelector,
  (showTarget, focusedCell, sortModel, maximumTreeDepth, rowId: GridRowId) =>
    showTarget && focusedCell?.id === rowId && sortModel.length === 0 && maximumTreeDepth === 1,
);

/**
 * The field of the focused cell or column header when its header is marked, `null` otherwise.
 */
export const gridColumnKeyboardReorderTargetFieldSelector = createSelector(
  gridKeyboardReorderShowTargetSelector,
  gridFocusCellSelector,
  gridFocusColumnHeaderSelector,
  (showTarget, cell, header) => (showTarget ? (cell?.field ?? header?.field ?? null) : null),
);
