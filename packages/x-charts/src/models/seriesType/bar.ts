import { DefaultizedProps } from '../helpers';
import {
  CartesianSeriesType,
  CommonSeriesType,
  CommonDefaultizedProps,
  StackableSeriesType,
} from './common';

export interface BarSeriesType
  extends CommonSeriesType<number>,
    CartesianSeriesType,
    StackableSeriesType {
  type: 'bar';
  /**
   * Data associated to each bar.
   */
  data?: number[];
  /**
   * The key used to retrive data from the dataset.
   */
  dataKey?: string;
  label?: string;
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
  extends DefaultizedProps<BarSeriesType, CommonDefaultizedProps | 'color'> {}
