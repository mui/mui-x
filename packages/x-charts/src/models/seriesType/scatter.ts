import { DefaultizedProps } from '../helpers';
import { CartesianSeriesType, CommonSeriesType, DefaultizedCommonSeriesType } from './common';

export interface ScatterSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'scatter';
  data: { x: unknown; y: unknown; id: string | number }[];
  markerSize?: number;
}

/**
 * An object that allows to identify a single line.
 * Used for item interaction
 */
export type ScatterItemIdentifier = {
  type: 'scatter';
  seriesId: ScatterSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedScatterSeriesType
  extends DefaultizedProps<ScatterSeriesType, 'xAxisKey' | 'yAxisKey'>,
    DefaultizedCommonSeriesType {}
