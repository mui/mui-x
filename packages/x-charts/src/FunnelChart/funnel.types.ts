import { CurveType } from '../models/curve';
import { DefaultizedProps } from '../models/helpers';
import type {
  CommonDefaultizedProps,
  CommonSeriesType,
  CartesianSeriesType,
  StackableSeriesType,
} from '../models/seriesType/common';

export interface FunnelSeriesType
  extends CommonSeriesType<number>,
    CartesianSeriesType,
    StackableSeriesType {
  type: 'funnel';
  /**
   * Data associated to the funnel slice.
   */
  // TODO: unorthodox data type, here I'm expecting a `number[]` rather than `{label,value}` like the pie.
  // mostly as a test to make data type more simple/flexible, thought it might not work properly with how we handle series data
  data?: number[];
  /**
   * The key used to retrieve data from the dataset.
   */
  dataKey?: string;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * Layout of the funnel.
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * The type of curve to use for the line. Read more about curves at
   * [line interpolation](https://mui.com/x/react-charts/lines/#interpolation).
   *
   * @default 'linear'
   */
  curve?: CurveType;
}

/**
 * An object that allows to identify a funnel item.
 * Used for item interaction
 */
export type FunnelItemIdentifier = {
  type: 'funnel';
  seriesId: DefaultizedFunnelSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedFunnelSeriesType
  extends DefaultizedProps<FunnelSeriesType, CommonDefaultizedProps | 'color' | 'layout'> {}
