import { GridDensity } from '../../../models/gridDensity';
import { DEFAULT_GRID_OPTIONS } from '../../../models/gridOptions';

export interface GridGridDensity {
  value: GridDensity;
  rowHeight: number;
  headerHeight: number;
}

export function getInitialGridDensityState(): GridGridDensity {
  return {
    value: DEFAULT_GRID_OPTIONS.density,
    rowHeight: DEFAULT_GRID_OPTIONS.rowHeight,
    headerHeight: DEFAULT_GRID_OPTIONS.headerHeight,
  };
}
