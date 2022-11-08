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
   * The custom component for aggregation menu item.
   * @default GridColumnMenuAggregationItem
   */
  ColumnMenuAggregationItem: React.JSXElementConstructor<any>;
  /**
   * The custom component for ungrouped menu item.
   * @default GridColumnMenuRowUngroupItem
   */
  ColumnMenuRowUngroupItem: React.JSXElementConstructor<any>;
  /**
   * The custom component for grouped menu item.
   * @default GridColumnMenuRowGroupItem
   */
  ColumnMenuRowGroupItem: React.JSXElementConstructor<any>;
}
