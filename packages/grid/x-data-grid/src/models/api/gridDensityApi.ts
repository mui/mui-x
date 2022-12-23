import * as React from 'react';
import { GridDensity, GridDensityTypes } from '../gridDensity';

export interface GridDensityOption {
  icon: React.ReactElement;
  label: string;
  value: GridDensityTypes;
}

/**
 * The density API interface that is available in the grid `apiRef`.
 */
export interface GridDensityApi {
  /**
   * Sets the density of the grid.
   * @param {string} density Can be: `"compact"`, `"standard"`, `"comfortable"`.
   */
  setDensity: (density: GridDensity) => void;
}
