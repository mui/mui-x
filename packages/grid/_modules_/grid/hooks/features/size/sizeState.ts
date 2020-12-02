import { DEFAULT_GRID_OPTIONS, Size } from '../../../models/gridOptions';

export interface SizeState {
  value: Size;
  rowHeight: number;
  headerHeight: number;
}

export function getInitialSizeState(): SizeState {
  return {
    value: DEFAULT_GRID_OPTIONS.size,
    rowHeight: DEFAULT_GRID_OPTIONS.rowHeight,
    headerHeight: DEFAULT_GRID_OPTIONS.headerHeight,
  };
}
