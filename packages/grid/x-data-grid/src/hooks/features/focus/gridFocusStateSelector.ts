import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridFocusState, GridOutlineState, GridTabIndexState } from './gridFocusState';

export const gridFocusStateSelector = (state: GridStateCommunity) => state.focus;

export const gridFocusCellSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.cell,
);

export const gridFocusColumnHeaderSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.columnHeader,
);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_gridFocusColumnGroupHeaderSelector = createSelector(
  gridFocusStateSelector,
  (focusState: GridFocusState) => focusState.columnGroupHeader,
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

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_gridTabIndexColumnGroupHeaderSelector = createSelector(
  gridTabIndexStateSelector,
  (state: GridTabIndexState) => state.columnGroupHeader,
);

export const gridOutlineStateSelector = (state: GridStateCommunity) => state.outline;

export const gridCellOutlineCellSelector = createSelector(
  gridOutlineStateSelector,
  (state: GridOutlineState) => state.cell,
);
