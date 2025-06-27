import * as React from 'react';
import { ChartBaseIconProps, ChartsIconSlotProps } from '@mui/x-charts/models';

export interface ChartsIconSlotPropsPro extends ChartsIconSlotProps {
  /**
   * Icon displayed on the toolbar's zoom in button.
   * @default ChartsZoomInIcon
   */
  zoomInIcon: ChartBaseIconProps;
  /**
   * Icon displayed on the toolbar's zoom out button.
   * @default ChartsZoomOutIcon
   */
  zoomOutIcon: ChartBaseIconProps;
  /**
   * Icon displayed on the toolbar's export button.
   * @default ChartsExportIcon
   */
  exportIcon: ChartBaseIconProps;
}

export type ChartsIconSlotsPro = {
  [key in keyof ChartsIconSlotPropsPro]: React.ComponentType<ChartsIconSlotPropsPro[key]>;
};
