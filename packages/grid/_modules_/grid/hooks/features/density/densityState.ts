import { DEFAULT_GRID_OPTIONS, Density } from '../../../models/gridOptions';

export interface DensityState {
  size: Density;
  rowHeight: number;
  headerHeight: number;
}

export function getInitialDensityState(): DensityState {
  return {
    size: DEFAULT_GRID_OPTIONS.density,
    rowHeight: DEFAULT_GRID_OPTIONS.rowHeight,
    headerHeight: DEFAULT_GRID_OPTIONS.headerHeight,
  };
}
