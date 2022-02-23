import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridFocusState, GridTabIndexState } from './gridFocusState';

export const gridFocusStateSelector = (state: GridStateCommunity) => state.focus;

export const gridFocusCellSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.cell,
);

export const gridFocusColumnHeaderSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.columnHeader,
);

export const gridTabIndexStateSelector = (state: GridStateCommunity) => state.tabIndex;

export const gridTabIndexCellSelector = createSelector(
  gridTabIndexStateSelector,
  (state: GridTabIndexState) => state.cell,
);

export const gridTabIndexColumnHeaderSelector = createSelector(
  gridTabIndexStateSelector,
  (state: GridTabIndexState) => state.columnHeader,
);
