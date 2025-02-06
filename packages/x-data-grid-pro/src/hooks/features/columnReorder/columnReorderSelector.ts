import { RefObject } from '@mui/x-internals/types';
import { createSelector } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';

export const gridColumnReorderSelector = (apiRef: RefObject<GridApiPro>) =>
  apiRef.current.state.columnReorder;

export const gridColumnReorderDragColSelector = createSelector(
  gridColumnReorderSelector,
  (columnReorder) => columnReorder.dragCol,
);
