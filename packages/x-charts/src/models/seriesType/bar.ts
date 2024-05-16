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
  /**
   * Can be set to 'value' or 'formattedValue' to display the value or the formatted value.
   * If a function is provided it will be used to format the label of the bar.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel?:
    | 'value'
    | 'formattedValue'
    | ((item: BarItem, context: BarLabelContext) => string | null);
}

export type BarItem = {
  /**
   * The series id of the bar.
   */
  seriesId: DefaultizedBarSeriesType['id'];
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  /**
   * The value of the data point.
   */
  value: number | null;
};

export type BarLabelContext = {
  bar: {
    /**
     * The height of the bar. Useful if you want to show the label only when the bar is big enough.
     */
    height: number;
    /**
     * The width of the bar. Useful if you want to show the label only when the bar is big enough.
     */
    width: number;
  };
};

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
