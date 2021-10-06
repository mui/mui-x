import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';

export interface GridDensityState {
  value: GridDensity;
  rowHeight: number;
  headerHeight: number;
}

export function getInitialGridDensityState(): GridDensityState {
  return {
    value: GridDensityTypes.Standard,
    rowHeight: 52,
    headerHeight: 56,
  };
}
