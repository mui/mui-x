import { DefaultizedProps } from '../helpers';
import {
  CartesianSeriesType,
  CommonSeriesType,
  DefaultizedCommonSeriesType,
  StackableSeriesType,
} from './common';

export interface BarSeriesType extends CommonSeriesType, CartesianSeriesType, StackableSeriesType {
  type: 'bar';
  data: number[];
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
