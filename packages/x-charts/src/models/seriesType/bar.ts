import { DefaultizedProps } from '@mui/x-internals/types';
import type { StackOffsetType } from '../stacking';
import {
  CartesianSeriesType,
  CommonSeriesType,
  CommonDefaultizedProps,
  StackableSeriesType,
  SeriesId,
} from './common';

export interface BarSeriesType
  extends CommonSeriesType<number | null>,
    CartesianSeriesType,
    StackableSeriesType {
  type: 'bar';
  /**
   * Data associated to each bar.
   */
  data?: readonly (number | null)[];
  /**
   * The key used to retrieve data from the dataset.
   */
  dataKey?: string;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * Layout of the bars. All bar should have the same layout.
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Defines how stacked series handle negative values.
   * @default 'diverging'
   */
  stackOffset?: StackOffsetType;
  /**
   * If provided, the value will be used as the minimum size of the bar in pixels.
   * This is useful to avoid bars with a size of 0.
   *
   * The property is ignored if the series value is `null` or `0`.
   * It also doesn't work with stacked series.
   *
   * @default 0px
   */
  minBarSize?: number;
}

/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type BarItemIdentifier = {
  type: 'bar';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedBarSeriesType
  extends DefaultizedProps<
    BarSeriesType,
    CommonDefaultizedProps | 'color' | 'layout' | 'minBarSize'
  > {}
