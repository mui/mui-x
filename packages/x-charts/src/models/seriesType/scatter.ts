import { CartesianSeriesType, CommonSeriesType } from './common';

export interface ScatterSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'scatter';
  data: { x: unknown; y: unknown; id: string | number }[];
  markerSize?: number;
}
