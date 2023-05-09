import { DefaultizedProps } from '../helpers';
import { CartesianSeriesType, CommonSeriesType, DefaultizedCommonSeriesType } from './common';

export interface BarSeriesType extends CommonSeriesType, CartesianSeriesType {
  type: 'bar';
  data: number[];
  stack?: string;
  label?: string;
}

/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type BarItemIdentifier = {
  type: 'bar';
  seriesId: DefaultizedBarSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedBarSeriesType
  extends DefaultizedProps<BarSeriesType, 'id'>,
    DefaultizedCommonSeriesType<number> {}
