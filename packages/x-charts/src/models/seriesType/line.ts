import { CartesianSeriesType, CommonSeriesType } from './common';

export interface LineSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'line';
  data: number[]
}
