import * as React from 'react';
import { GridSlotsComponent } from '@mui/x-data-grid';
import { GridProIconSlotsComponent } from './gridProIconSlotsComponent';

/**
 * Grid components React prop interface containing all the overridable components
 * for Pro package
 */
export interface GridProSlotsComponent extends GridSlotsComponent, GridProIconSlotsComponent {
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   * @default GridColumnMenuPinningItems
   */
  ColumnMenuPinningItem: React.JSXElementConstructor<any>;
}
