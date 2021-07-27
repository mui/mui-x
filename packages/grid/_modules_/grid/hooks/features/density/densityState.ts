import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';

export interface GridGridDensity {
  value: GridDensity;
  rowHeight: number;
  headerHeight: number;
}

export const DEFAULT_GRID_DENSITY = GridDensityTypes.Standard;

export const DEFAULT_GRID_ROW_HEIGHT = 52;

export const DEFAULT_GRID_HEADER_HEIGHT = 56;

export function getInitialGridDensityState(): GridGridDensity {
  return {
    value: DEFAULT_GRID_DENSITY,
    rowHeight: DEFAULT_GRID_ROW_HEIGHT,
    headerHeight: DEFAULT_GRID_HEADER_HEIGHT,
  };
}
