import { unstable_createSelector as createSelector } from '@mui/x-data-grid';
import { GridStatePro } from '../../../models/gridStatePro';

export const gridRowReorderSelector = (state: GridStatePro) => state.rowReorder;

export const gridRowReorderDragRowSelector = createSelector(
  gridRowReorderSelector,
  (rowReorder) => rowReorder.dragRow,
);
