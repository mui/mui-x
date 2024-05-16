import { DefaultizedProps } from '../helpers';
import type { StackOffsetType } from '../stacking';
import {
  CartesianSeriesType,
  CommonSeriesType,
  CommonDefaultizedProps,
  StackableSeriesType,
} from './common';

export interface BarSeriesType
  extends CommonSeriesType<number | null>,
    CartesianSeriesType,
    StackableSeriesType {
  type: 'bar';
  /**
   * Data associated to each bar.
   */
  data?: (number | null)[];
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
}

/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type BarItemIdentifier = {
  type: 'bar';
  seriesId: DefaultizedBarSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedBarSeriesType
  extends DefaultizedProps<BarSeriesType, CommonDefaultizedProps | 'color' | 'layout'> {}
