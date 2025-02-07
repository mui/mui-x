import { RefObject } from '@mui/x-internals/types';
import { createSelector } from '../../../utils/createSelector';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridFocusState, GridTabIndexState } from './gridFocusState';

export const gridFocusStateSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.focus;

export const gridFocusCellSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.cell,
);

export const gridFocusColumnHeaderSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.columnHeader,
);

export const gridFocusColumnHeaderFilterSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.columnHeaderFilter,
);

export const gridFocusColumnGroupHeaderSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.columnGroupHeader,
);

export const gridTabIndexStateSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.tabIndex;

export const gridTabIndexCellSelector = createSelector(
  gridTabIndexStateSelector,
  (state: GridTabIndexState) => state.cell,
);

export const gridTabIndexColumnHeaderSelector = createSelector(
  gridTabIndexStateSelector,
  (state: GridTabIndexState) => state.columnHeader,
);

export const gridTabIndexColumnHeaderFilterSelector = createSelector(
  gridTabIndexStateSelector,
  (state: GridTabIndexState) => state.columnHeaderFilter,
);

export const gridTabIndexColumnGroupHeaderSelector = createSelector(
  gridTabIndexStateSelector,
  (state: GridTabIndexState) => state.columnGroupHeader,
);
