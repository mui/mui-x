import { type ChartsLabelMarkProps } from '@mui/x-charts/ChartsLabel';
import {
  type CommonSeriesType,
  type CartesianSeriesType,
  type CommonDefaultizedProps,
  type SeriesId,
} from '@mui/x-charts/internals';
import { type Position } from '@mui/x-charts/models';
import { type DefaultizedProps, type MakeRequired } from '@mui/x-internals/types';
import { type FunnelCurveType } from './curves';

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
  label?: string | ((location: 'tooltip' | 'legend' | 'section') => string | undefined);
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
  extends
    Omit<CommonSeriesType<FunnelValueType, 'funnel'>, 'color' | 'colorGetter'>,
    CartesianSeriesType {
  type: 'funnel';
  /**
   * Data associated to the funnel section.
   */
  data: Readonly<FunnelValueType[]>;
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
   * The type of curve to use for the line.
   *
   * - `bump`: A curve that creates a smooth transition between points, with a bump in the middle.
   * - `linear`: A straight line between points.
   * - `linear-sharp`: A straight line between points, the smaller end of the funnel is a triangle.
   * - `step`: A step line that creates a staircase effect.
   * - `pyramid`: A pyramid shape that connects the points.
   * - `step-pyramid`: A step line that creates a staircase effect, with a pyramid shape.
   *
   * Read more about curves at [curve interpolation](https://mui.com/x/react-charts/funnel/#curve-interpolation).
   * @default 'linear'
   */
  curve?: FunnelCurveType;
  /**
   * The radius, in pixels, of the corners of the funnel sections.
   * @default 8
   */
  borderRadius?: number;
  /**
   * The label configuration for the funnel plot.
   * Allows to customize the position and margin of the label that is displayed on the funnel sections.
   *
   * If set to `false`, the label will not be displayed.
   * @default { vertical: 'middle', horizontal: 'center' }
   */
  sectionLabel?: FunnelLabelOptions | ((item: FunnelItem) => FunnelLabelOptions | false) | false;
  /**
   * Defines if the funnel sections are filled or outlined.
   *
   * An `outlined` funnel will have a stroke around the sections and a translucent fill.
   * A `filled` funnel will have a solid fill and no stroke.
   *
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';
  /**
   * Controls how the funnel is drawn.
   * Ignored on `step` and `linear-sharp` curves.
   *
   * This affects different curves in different ways:
   * - `bump` & `linear`: Controls which section is the "starting" point of the funnel. This section has straight edges.
   * - `pyramid` & `step-pyramid`: Fully changes the direction of the shape.
   *
   * @default 'auto'
   */
  funnelDirection?: 'increasing' | 'decreasing' | 'auto';
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

export interface DefaultizedFunnelSeriesType extends Omit<
  DefaultizedProps<FunnelSeriesType, CommonDefaultizedProps | 'layout'>,
  'funnelDirection'
> {
  dataPoints: FunnelDataPoints[][];
  data: Readonly<MakeRequired<FunnelValueType, 'id' | 'color'>[]>;
  funnelDirection: 'increasing' | 'decreasing';
}

export type FunnelDataPoints = Record<'x' | 'y', number> & {
  useBandWidth: boolean;
  stackOffset: number;
};

export type FunnelLabelOptions = {
  /**
   * The position of the label.
   * @default { vertical: 'middle', horizontal: 'center' }
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
   * The offset of the label from the anchor point.
   * If a single number is provided, the offset will be applied in both directions.
   * @default 0
   */
  offset?: number | { x?: number; y?: number };
};
