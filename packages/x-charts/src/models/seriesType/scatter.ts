import { DefaultizedProps } from '../helpers';
import { CartesianSeriesType, CommonSeriesType, CommonDefaultizedProps } from './common';

type ScatterValueType = { x: unknown; y: unknown; id: string | number };

export interface ScatterSeriesType extends CommonSeriesType<ScatterValueType>, CartesianSeriesType {
  type: 'scatter';
  data: ScatterValueType[];
  markerSize?: number;
  label?: string;
}

/**
 * An object that allows to identify a single line.
 * Used for item interaction
 */
export type ScatterItemIdentifier = {
  type: 'scatter';
  seriesId: DefaultizedScatterSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedScatterSeriesType
  extends DefaultizedProps<ScatterSeriesType, CommonDefaultizedProps> {}
