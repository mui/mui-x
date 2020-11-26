import * as React from 'react';
import { DensityTypes, Density } from '../gridOptions';

export interface DensityConfig {
  density: Density;
  headerHeight: number;
  rowHeight: number;
}

export interface DensityOption {
  icon: React.ReactElement;
  label: DensityTypes;
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
  setDensity: (density: Density, headerHeight?, rowHeight?) => void;
}
