import { createSelector } from '../../../utils/createSelector';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const gridColumnResizeSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.columnResize;

export const gridResizingColumnFieldSelector = createSelector(
  gridColumnResizeSelector,
  (columnResize) => columnResize.resizingColumnField,
);
