import { createSelector } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';

export const gridColumnReorderSelector = (apiRef: React.RefObject<GridApiPro>) =>
  apiRef.current.state.columnReorder;

export const gridColumnReorderDragColSelector = createSelector(
  gridColumnReorderSelector,
  (columnReorder) => columnReorder.dragCol,
);
