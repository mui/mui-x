import { RefObject } from '@mui/x-internals/types';
import { createSelector } from '../../../utils/createSelector';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const gridColumnResizeSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.columnResize;

export const gridResizingColumnFieldSelector = createSelector(
  gridColumnResizeSelector,
  (columnResize) => columnResize.resizingColumnField,
);
