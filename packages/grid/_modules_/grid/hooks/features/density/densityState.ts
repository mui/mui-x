import { DEFAULT_GRID_OPTIONS, Density } from '../../../models/gridOptions';

export interface DensityState {
  value: Density;
  rowHeight: number;
  headerHeight: number;
}

export function getInitialDensityState(): DensityState {
  return {
    value: DEFAULT_GRID_OPTIONS.density,
    rowHeight: DEFAULT_GRID_OPTIONS.rowHeight,
    headerHeight: DEFAULT_GRID_OPTIONS.headerHeight,
  };
}
