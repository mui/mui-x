import * as React from 'react';
import { Density, GridDensityTypes } from '../density';

export interface DensityOption {
  icon: React.ReactElement;
  label: string;
  value: GridDensityTypes;
}

/**
 * The density API interface that is available in the grid [[apiRef]].
 */
export interface DensityApi {
  /**
   * Set density of the grid.
   * @param density
   * @returns void
   */
  setDensity: (size: Density, headerHeight?, rowHeight?) => void;
}
