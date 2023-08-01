import { DefaultizedProps } from '../helpers';
import {
  CartesianSeriesType,
  CommonDefaultizedProps,
  CommonSeriesType,
  StackableSeriesType,
} from './common';

export type CurveType =
  | 'catmullRom'
  | 'linear'
  | 'monotoneX'
  | 'monotoneY'
  | 'natural'
  | 'step'
  | 'stepBefore'
  | 'stepAfter';

export interface LineSeriesType
  extends CommonSeriesType<number>,
    CartesianSeriesType,
    StackableSeriesType {
  type: 'line';
  /**
   * Data associated to the line.
   */
  data?: number[];
  /**
   * The key used to retrive data from the dataset.
   */
  dataKey?: string;
  stack?: string;
  area?: boolean;
  label?: string;
  curve?: CurveType;
}

/**
 * An object that allows to identify a single line.
 * Used for item interaction
 */
export type LineItemIdentifier = {
  type: 'line';
  seriesId: DefaultizedLineSeriesType['id'];
  /**
   * `dataIndex` can be `undefined` if the mouse is over the area and not a specific item.
   */
  dataIndex?: number;
};

export interface DefaultizedLineSeriesType
  extends DefaultizedProps<LineSeriesType, CommonDefaultizedProps | 'color'> {}
