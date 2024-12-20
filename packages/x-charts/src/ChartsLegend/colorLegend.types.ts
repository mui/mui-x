import { AxisId } from '../models/axis';

export interface ColorLegendSelector {
  /**
   * The axis direction containing the color configuration to represent.
   * @default 'z'
   */
  axisDirection?: 'x' | 'y' | 'z';
  /**
   * The id of the axis item with the color configuration to represent.
   * @default The first axis item.
   */
  axisId?: AxisId;
}
