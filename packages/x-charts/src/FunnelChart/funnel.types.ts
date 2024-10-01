import { DefaultizedProps } from '../models/helpers';
import type {
  CommonDefaultizedProps,
  CommonSeriesType,
  CartesianSeriesType,
  StackableSeriesType,
} from '../models/seriesType/common';

export interface FunnelSeriesType
  extends CommonSeriesType<number | null>,
    CartesianSeriesType,
    StackableSeriesType {
  type: 'funnel';
  /**
   * Data associated to the funnel slice.
   */
  data?: (number | null)[];
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
