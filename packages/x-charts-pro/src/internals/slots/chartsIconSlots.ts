import type * as React from 'react';
import { type ChartBaseIconProps, type ChartsIconSlots } from '@mui/x-charts/models';

export interface ChartsIconSlotsPro extends ChartsIconSlots {
  /**
   * Icon displayed on the toolbar's zoom in button.
   * @default ChartsZoomInIcon
   */
  zoomInIcon: React.ComponentType<ChartBaseIconProps>;
  /**
   * Icon displayed on the toolbar's zoom out button.
   * @default ChartsZoomOutIcon
   */
  zoomOutIcon: React.ComponentType<ChartBaseIconProps>;
  /**
   * Icon displayed on the toolbar's export button.
   * @default ChartsExportIcon
   */
  exportIcon: React.ComponentType<ChartBaseIconProps>;
}
