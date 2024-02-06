import type {
  ScaleBand,
  ScaleLogarithmic,
  ScalePower,
  ScaleTime,
  ScaleLinear,
  ScalePoint,
} from 'd3-scale';
import { ChartsAxisClasses } from '../ChartsAxis/axisClasses';
import type { TickParams } from '../hooks/useTicks';
import { ChartsTextProps } from '../ChartsText';

export type D3Scale<
  Domain extends { toString(): string } = number | Date | string,
  Range = number,
  Output = number,
> =
  | ScaleBand<Domain>
  | ScaleLogarithmic<Range, Output>
  | ScalePoint<Domain>
  | ScalePower<Range, Output>
  | ScaleTime<Range, Output>
  | ScaleLinear<Range, Output>;

export type D3ContinuouseScale<Range = number, Output = number> =
  | ScaleLogarithmic<Range, Output>
  | ScalePower<Range, Output>
  | ScaleTime<Range, Output>
  | ScaleLinear<Range, Output>;

export interface ChartsAxisSlots {
  axisLine?: React.JSXElementConstructor<React.SVGAttributes<SVGPathElement>>;
  axisTick?: React.JSXElementConstructor<React.SVGAttributes<SVGPathElement>>;
  axisTickLabel?: React.JSXElementConstructor<ChartsTextProps>;
  axisLabel?: React.JSXElementConstructor<ChartsTextProps>;
}

export interface ChartsAxisSlotProps {
  axisLine?: Partial<React.SVGAttributes<SVGPathElement>>;
  axisTick?: Partial<React.SVGAttributes<SVGPathElement>>;
  axisTickLabel?: Partial<ChartsTextProps>;
  axisLabel?: Partial<ChartsTextProps>;
}

export interface ChartsAxisProps extends TickParams {
  /**
   * The id of the axis to render.
   * If undefined, it will be the first defined axis.
   */
  axisId?: string;
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine?: boolean;
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks?: boolean;
  /**
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill?: string;
  /**
   * The font size of the axis ticks text.
   * @default 12
   * @deprecated Consider using `tickLabelStyle.fontSize` instead.
   */
  tickFontSize?: number;
  /**
   * The style applied to ticks text.
   */
  tickLabelStyle?: ChartsTextProps['style'];
  /**
   * The style applied to the axis label.
   */
  labelStyle?: ChartsTextProps['style'];
  /**
   * Defines which ticks get its label displayed. Its value can be:
   * - 'auto' In such case, labels are displayed if they do not overlap with the previous one.
   * - a filtering function of the form (value, index) => boolean. Warning: the index is tick index, not data ones.
   * @default 'auto'
   */
  tickLabelInterval?: 'auto' | ((value: any, index: number) => boolean);
  /**
   * The label of the axis.
   */
  label?: string;
  /**
   * The font size of the axis label.
   * @default 14
   * @deprecated Consider using `labelStyle.fontSize` instead.
   */
  labelFontSize?: number;
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke?: string;
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize?: number;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsAxisClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<ChartsAxisSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: Partial<ChartsAxisSlotProps>;
}

export interface ChartsYAxisProps extends ChartsAxisProps {
  /**
   * Position of the axis.
   */
  position?: 'left' | 'right';
}

export interface ChartsXAxisProps extends ChartsAxisProps {
  /**
   * Position of the axis.
   */
  position?: 'top' | 'bottom';
}

export type ScaleName = 'linear' | 'band' | 'point' | 'log' | 'pow' | 'sqrt' | 'time' | 'utc';
export type ContinuouseScaleName = 'linear' | 'log' | 'pow' | 'sqrt' | 'time' | 'utc';

interface AxisScaleConfig {
  band: {
    scaleType: 'band';
    scale: ScaleBand<number | Date | string>;
    /**
     * The ratio between the space allocated for padding between two categories and the category width.
     * 0 means no gap, and 1 no data.
     * @default 0.2
     */
    categoryGapRatio: number;
    /**
     * The ratio between the width of a bar, and the gap between two bars.
     * 0 means no gap, and 1 no bar.
     * @default 0.1
     */
    barGapRatio: number;
  };
  point: {
    scaleType: 'point';
    scale: ScalePoint<number | Date | string>;
  };
  log: {
    scaleType: 'log';
    scale: ScaleLogarithmic<number, number>;
  };
  pow: {
    scaleType: 'pow';
    scale: ScalePower<number, number>;
  };
  sqrt: {
    scaleType: 'sqrt';
    scale: ScalePower<number, number>;
  };
  time: {
    scaleType: 'time';
    scale: ScaleTime<number, number>;
  };
  utc: {
    scaleType: 'utc';
    scale: ScaleTime<number, number>;
  };
  linear: {
    scaleType: 'linear';
    scale: ScaleLinear<number, number>;
  };
}

export type AxisConfig<S extends ScaleName = ScaleName, V = any> = {
  /**
   * Id used to identify the axis.
   */
  id: string;
  /**
   * The minimal value of the domain.
   * If not provided, it gets computed to display the entire chart data.
   */
  min?: number | Date;
  /**
   * The maximal value of the domain.
   * If not provided, it gets computed to display the entire chart data.
   */
  max?: number | Date;
  /**
   * The data used by `'band'` and `'point'` scales.
   */
  data?: V[];
  /**
   * The key used to retrieve `data` from the `dataset` prop.
   */
  dataKey?: string;
  valueFormatter?: (value: V) => string;
  /**
   * If `true`, hide this value in the tooltip
   */
  hideTooltip?: boolean;
  /**
   * If `true`, Reverse the axis scaleBand.
   */
  reverse?: boolean;
} & Partial<ChartsXAxisProps | ChartsYAxisProps> &
  Partial<Omit<AxisScaleConfig[S], 'scale'>> &
  TickParams;

export type AxisDefaultized<S extends ScaleName = ScaleName, V = any> = Omit<
  AxisConfig<S, V>,
  'scaleType'
> &
  AxisScaleConfig[S] & {
    /**
     * An indication of the expected number of ticks.
     */
    tickNumber: number;
  };

export function isBandScaleConfig(
  scaleConfig: AxisConfig<ScaleName>,
): scaleConfig is AxisConfig<'band'> & { scaleType: 'band' } {
  return scaleConfig.scaleType === 'band';
}

export function isPointScaleConfig(
  scaleConfig: AxisConfig<ScaleName>,
): scaleConfig is AxisConfig<'point'> & { scaleType: 'point' } {
  return scaleConfig.scaleType === 'point';
}
