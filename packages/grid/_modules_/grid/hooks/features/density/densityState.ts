import { DEFAULT_GRID_OPTIONS, Size } from '../../../models/gridOptions';

export interface DensityState {
  size: Size;
  rowHeight: number;
  headerHeight: number;
}

export function getInitialDensityState(): DensityState {
  return {
    size: DEFAULT_GRID_OPTIONS.size,
    rowHeight: DEFAULT_GRID_OPTIONS.rowHeight,
    headerHeight: DEFAULT_GRID_OPTIONS.headerHeight,
  };
}
