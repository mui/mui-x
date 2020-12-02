import * as React from 'react';
import { SizeTypes, Size } from '../gridOptions';

export interface SizeOption {
  icon: React.ReactElement;
  label: SizeTypes;
}

/**
 * The size API interface that is available in the grid [[apiRef]].
 */
export interface SizeApi {
  /**
   * Set size of the grid.
   * @param size
   * @returns void
   */
  setSize: (size: Size, headerHeight?, rowHeight?) => void;
}
