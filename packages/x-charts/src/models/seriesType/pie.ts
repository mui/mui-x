import { CartesianSeriesType, CommonSeriesType } from './common';

export interface PieSeriesType extends CommonSeriesType<number>, CartesianSeriesType {
  type: 'pie';
  data: number[];
}
