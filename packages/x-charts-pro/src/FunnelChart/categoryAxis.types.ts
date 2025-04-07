import { AxisConfig, ScaleName } from '@mui/x-charts/models';
import { MakeOptional } from '@mui/x-internals/types';

export type CategoryAxis = {
  /**
   * The categories to be displayed on the axis.
   * The order of the categories is the order in which they are displayed.
   */
  categories?: string[];
  /**
   * The position of the axis.
   * - 'left' - The axis is positioned on the left side of the chart.
   * - 'right' - The axis is positioned on the right side of the chart.
   * - 'top' - The axis is positioned on the top side of the chart.
   * - 'bottom' - The axis is positioned on the bottom side of the chart.
   * - 'none' - The axis is not displayed.
   */
  position?: 'left' | 'right' | 'top' | 'bottom' | 'none';
  /**
   * The size of the axis.
   * - If the axis is horizontal, the size is the height of the axis.
   * - If the axis is vertical, the size is the width of the axis.
   */
  size?: number;
} & MakeOptional<
  Pick<
    AxisConfig<ScaleName, any>,
    'disableLine' | 'disableTicks' | 'scaleType' | 'tickLabelStyle' | 'tickSize' | 'id'
  >,
  'id'
>;
