import { CartesianSeriesType, CommonSeriesType } from './common';

export interface BarSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'bar';
}
