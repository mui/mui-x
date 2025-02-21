import { ChartsLabelMarkProps } from '@mui/x-charts/ChartsLabel';
import {
  CommonSeriesType,
  CartesianSeriesType,
  CommonDefaultizedProps,
  SeriesId,
} from '@mui/x-charts/internals';
import { CurveType, Position } from '@mui/x-charts/models';
import { DefaultizedProps } from '@mui/x-internals/types';

export type FunnelItemId = string | number;

export type FunnelCurveType = Extract<CurveType, 'linear' | 'step' | 'bumpY' | 'bumpX'>;

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

export interface FunnelSeriesType
  extends Omit<CommonSeriesType<FunnelValueType>, 'color'>,
    CartesianSeriesType {
  type: 'funnel';
  /**
   * Data associated to the funnel section.
   */
  data?: Readonly<FunnelValueType[]>;
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
  curve?: FunnelCurveType;
  /**
   * The label configuration for the funnel plot.
   * Allows to customize the position and margin of the label that is displayed on the funnel sections.
   *
   * @default { vertical: 'middle', horizontal: 'middle' }
   */
  sectionLabel?: false | FunnelLabelOptions | ((item: FunnelItem) => FunnelLabelOptions | false);
}

/**
 * An object that allows to identify a funnel item.
 * Used for item interaction
 */
export type FunnelItemIdentifier = {
  type: 'funnel';
  /**
   * The series id of the funnel.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
};

export type FunnelItem = {
  /**
   * The series id of the funnel.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  /**
   * The value of the data point.
   */
  value: number;
};

export interface DefaultizedFunnelSeriesType
  extends DefaultizedProps<FunnelSeriesType, CommonDefaultizedProps | 'layout'> {
  dataPoints: FunnelDataPoints[][];
}

export type FunnelDataPoints = Record<'x' | 'y', number> & {
  useBandWidth: boolean;
  stackOffset: number;
};

export type FunnelLabelOptions = {
  /**
   * The position of the label.
   * @default { vertical: 'middle', horizontal: 'middle' }
   */
  position?: Position;
  /**
   * The text anchor of the label. Affects the horizontal alignment of the text.
   *
   * Default value depends on the position.
   */
  textAnchor?: 'start' | 'middle' | 'end';
  /**
   * The dominant baseline of the label. Affects the vertical alignment of the text.
   *
   * Default value depends on the position.
   */
  dominantBaseline?:
    | 'auto'
    | 'baseline'
    | 'hanging'
    | 'middle'
    | 'central'
    | 'text-after-edge'
    | 'text-before-edge';
  /**
   * The margin of the label.
   * @default 0
   */
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
};
