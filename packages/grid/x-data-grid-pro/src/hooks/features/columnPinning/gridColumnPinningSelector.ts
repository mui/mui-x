import { GridStatePro } from '../../../models/gridStatePro';

export const gridPinnedColumnsStateSelector = (state: GridStatePro) => state.pinnedColumns;

// FIXME: The `?.` should not be necessary here.
export const gridPinnedColumnsSelector = (state: GridStatePro) => state.pinnedColumns?.model;

export const gridVisiblePinnedColumnsSelector = (state: GridStatePro) =>
  state.pinnedColumns.visible;
