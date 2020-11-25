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
 * The density picker API interface that is available in the grid [[apiRef]].
 */
export interface DensityPickerApi {
  /**
   * Set density of the grid.
   * @param density
   * @returns void
   */
  setDensity: (density: Density) => void;
}
