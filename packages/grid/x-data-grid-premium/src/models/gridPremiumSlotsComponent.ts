import { GridProSlotsComponent } from '@mui/x-data-grid-pro';
import { GridPremiumIconSlotsComponent } from './gridPremiumIconSlotsComponent';

/**
 * Grid components React prop interface containing all the overridable components
 * for Premium package
 */
export interface GridPremiumSlotsComponent
  extends GridProSlotsComponent,
    GridPremiumIconSlotsComponent {
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   * @default GridAggregationColumnMenuItem
   */
  ColumnMenuAggregationItem: React.JSXElementConstructor<any>;
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   * @default GridRowGroupingColumnMenuItems
   */
  ColumnMenuRowGroupingItem: React.JSXElementConstructor<any>;
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   * @default GridRowGroupableColumnMenuItems
   */
  ColumnMenuRowGroupableItem: React.JSXElementConstructor<any>;
}
