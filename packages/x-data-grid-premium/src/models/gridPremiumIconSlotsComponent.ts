import * as React from 'react';
import { BaseSlots } from '@mui/x-data-grid/internals';

type IconProps = BaseSlots.IconProps;

export interface GridPremiumIconSlotsComponent {
  /**
   * Icon displayed in column menu for ungrouping
   * @default GridWorkspacesIcon
   */
  columnMenuUngroupIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for grouping
   * @default GridGroupWorkIcon
   */
  columnMenuGroupIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for aggregation
   * @default GridFunctionsIcon
   */
  columnMenuAggregationIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the button that sends a prompt
   * @default GridFunctionsIcon
   */
  toolbarPromptSendIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon used for the button that starts/stops recording the prompt
   * @default GridFunctionsIcon
   */
  toolbarPromptRecordIcon: React.JSXElementConstructor<IconProps>;
}
