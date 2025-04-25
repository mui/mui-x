import * as React from 'react';
import { IconProps } from './chartsBaseSlotProps';

export interface ChartsIconSlots {
  /**
   * Icon displayed on the toolbar's zoom in button.
   * @default ChartsZoomInIcon
   */
  zoomInIcon: React.ComponentType<IconProps>;
  /**
   * Icon displayed on the toolbar's zoom out button.
   * @default ChartsZoomOutIcon
   */
  zoomOutIcon: React.ComponentType<IconProps>;
}
