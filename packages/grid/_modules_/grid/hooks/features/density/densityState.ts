import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';

export interface GridGridDensity {
  value: GridDensity;
  rowHeight: number;
  headerHeight: number;
}

export function getInitialGridDensityState(): GridGridDensity {
  return {
    value: GridDensityTypes.Standard,
    rowHeight: 52,
    headerHeight: 56,
  };
}
