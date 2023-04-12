import { DefaultizedProps } from '../helpers';
import { CartesianSeriesType, CommonSeriesType, DefaultizedCommonSeriesType } from './common';

export interface BarSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'bar';
  data: number[];
  stack?: string;
}

export interface DefaultizedBarSeriesType
  extends DefaultizedProps<BarSeriesType, 'xAxisKey' | 'yAxisKey'>,
    DefaultizedCommonSeriesType {}
