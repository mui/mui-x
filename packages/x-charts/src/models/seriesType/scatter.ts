import { DefaultizedProps } from '../helpers';
import { CartesianSeriesType, CommonDefaultizedProps, CommonSeriesType } from './common';

export type ScatterValueType = { x: number; y: number; id: string | number };

export interface ScatterSeriesType extends CommonSeriesType<ScatterValueType>, CartesianSeriesType {
  type: 'scatter';
  data: ScatterValueType[];
  markerSize?: number;
  label?: string;
}

/**
 * An object that allows to identify a single scatter item.
 * Used for item interaction
 */
export type ScatterItemIdentifier = {
  type: 'scatter';
  seriesId: DefaultizedScatterSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedScatterSeriesType
  extends DefaultizedProps<ScatterSeriesType, CommonDefaultizedProps> {}
