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
   * @param {number} headerHeight The new header height.
   * @param {number} rowHeight The new row height.
   */
  setDensity: (density: GridDensity, headerHeight?: number, rowHeight?: number) => void;
}
