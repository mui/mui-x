import * as React from 'react';
import { SizeTypes, Size } from '../gridOptions';

export interface DensityOption {
  icon: React.ReactElement;
  label: SizeTypes;
}

/**
 * The density API interface that is available in the grid [[apiRef]].
 */
export interface DensityApi {
  /**
   * Set density of the grid.
   * @param size
   * @returns void
   */
  setDensity: (size: Size, headerHeight?, rowHeight?) => void;
}
