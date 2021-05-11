import * as React from 'react';
import { GridDensity, GridDensityTypes } from '../gridDensity';

export interface GridDensityOption {
  icon: React.ReactElement;
  label: string;
  value: GridDensityTypes;
}

/**
 * The density API interface that is available in the grid [[apiRef]].
 */
export interface GridDensityApi {
  /**
   * Set density of the grid.
   * @param density
   * @returns void
   */
  setDensity: (size: GridDensity, headerHeight?, rowHeight?) => void;
}
