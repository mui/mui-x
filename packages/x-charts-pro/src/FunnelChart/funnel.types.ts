import { ChartsLabelMarkProps } from '@mui/x-charts/ChartsLabel';
import {
  CommonSeriesType,
  CartesianSeriesType,
  CommonDefaultizedProps,
  SeriesId,
} from '@mui/x-charts/internals';
import { CurveType } from '@mui/x-charts/models';
import { DefaultizedProps } from '@mui/x-internals/types';

export type FunnelItemId = string | number;

export type FunnelValueType = {
  /**
   * A unique identifier of the funnel section.
   */
  id?: FunnelItemId;
  /**
   * The value of the funnel section.
   */
  value: number;
  /**
   * The label to display on the tooltip, funnel section, or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend' | 'section') => string);
  /**
   * The color of the funnel section
   */
  color?: string;
  /**
   * Defines the mark type for the funnel item.
   * @default 'square'
   */
  labelMarkType?: ChartsLabelMarkProps['type'];
};

export interface FunnelSeriesType<TData = FunnelValueType>
  extends Omit<CommonSeriesType<TData>, 'color'>,
    CartesianSeriesType {
  type: 'funnel';
  /**
   * Data associated to the funnel section.
   */
  data?: TData[];
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
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedFunnelSeriesType
  extends DefaultizedProps<FunnelSeriesType, CommonDefaultizedProps | 'layout'> {
  dataPoints: FunnelDataPoints[][];
}

export type FunnelDataPoints = Record<'x' | 'y', number> & {
  useBandWidth: boolean;
  stackOffset: number;
};
