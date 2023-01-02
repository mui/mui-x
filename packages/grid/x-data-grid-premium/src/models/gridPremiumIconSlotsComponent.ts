import * as React from 'react';

export interface GridPremiumIconSlotsComponent {
  /**
   * Icon displayed in column menu for ungrouping
   * @default GridWorkspacesIcon
   */
  ColumnMenuUngroupIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in column menu for grouping
   * @default GridGroupWorkIcon
   */
  ColumnMenuGroupIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed in column menu for aggregation
   * @default GridFunctionsIcon
   */
  ColumnMenuAggregationIcon: React.JSXElementConstructor<any>;
}
