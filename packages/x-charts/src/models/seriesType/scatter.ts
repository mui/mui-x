import { DefaultizedProps } from '../helpers';
import { CartesianSeriesType, CommonSeriesType, DefaultizedCommonSeriesType } from './common';

export interface ScatterSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'scatter';
  data: { x: unknown; y: unknown; id: string | number }[];
  markerSize?: number;
}

export interface DefaultizedScatterSeriesType
  extends DefaultizedProps<ScatterSeriesType, 'xAxisKey' | 'yAxisKey'>,
    DefaultizedCommonSeriesType {}
