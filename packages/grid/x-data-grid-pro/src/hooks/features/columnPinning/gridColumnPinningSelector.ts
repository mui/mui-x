import { GridStatePro } from '../../../models/gridStatePro';

export const gridPinnedColumnsStateSelector = (state: GridStatePro) => state.columns.pinnedColumns;

export const gridPinnedColumnsSelector = (state: GridStatePro) => state.columns.pinnedColumns.model;

export const gridVisiblePinnedColumnsSelector = (state: GridStatePro) =>
  state.columns.pinnedColumns.visible;
