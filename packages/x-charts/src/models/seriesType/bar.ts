import { DefaultizedProps } from '../helpers';
import { CartesianSeriesType, CommonSeriesType, DefaultizedCommonSeriesType } from './common';

export interface BarSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'bar';
  data: number[];
  stack?: string;
}

/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type BarItemIdentifier = {
  type: 'bar';
  seriesId: BarSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedBarSeriesType
  extends DefaultizedProps<BarSeriesType, 'xAxisKey' | 'yAxisKey'>,
    DefaultizedCommonSeriesType {}
