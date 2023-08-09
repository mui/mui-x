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

export type D3Scale =
  | ScaleBand<any>
  | ScaleLogarithmic<any, any>
  | ScalePoint<any>
  | ScalePower<any, any>
  | ScaleTime<any, any>
  | ScaleLinear<any, any>;

export type D3ContinuouseScale =
  | ScaleLogarithmic<any, any>
  | ScalePower<any, any>
  | ScaleTime<any, any>
  | ScaleLinear<any, any>;

export interface ChartsAxisSlotsComponent {
  axisLine?: React.JSXElementConstructor<React.SVGAttributes<SVGPathElement>>;
  axisTick?: React.JSXElementConstructor<React.SVGAttributes<SVGPathElement>>;
  axisTickLabel?: React.JSXElementConstructor<React.SVGAttributes<SVGTextElement>>;
  axisLabel?: React.JSXElementConstructor<React.SVGAttributes<SVGTextElement>>;
}

export interface ChartsAxisSlotComponentProps {
  axisLine?: Partial<React.SVGAttributes<SVGPathElement>>;
  axisTick?: Partial<React.SVGAttributes<SVGPathElement>>;
  axisTickLabel?: Partial<React.SVGAttributes<SVGTextElement>>;
  axisLabel?: Partial<React.SVGAttributes<SVGTextElement>>;
}

export interface ChartsAxisProps extends TickParams {
  /**
   * Id of the axis to render.
   */
  axisId: string;
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
   */
  tickFontSize?: number;
  /**
   * The label of the axis.
   */
  label?: string;
  /**
   * The font size of the axis label.
   * @default 14
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
  slots?: Partial<ChartsAxisSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: Partial<ChartsAxisSlotComponentProps>;
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
    scale: ScaleBand<any>;
    /**
     * The ratio between the space allocated for padding between two categories and the category width.
     * 0 means no gap, and 1 no data.
     * @default 0.1
     */
    categoryGapRatio: number;
    /**
     * The ratio between the width of a bar, and the gap between two bars.
     * 0 means no gap, and 1 no bar.
     * @default 0
     */
    barGapRatio: number;
  };
  point: {
    scaleType: 'point';
    scale: ScalePoint<any>;
  };
  log: {
    scaleType: 'log';
    scale: ScaleLogarithmic<any, any>;
  };
  pow: {
    scaleType: 'pow';
    scale: ScalePower<any, any>;
  };
  sqrt: {
    scaleType: 'sqrt';
    scale: ScalePower<any, any>;
  };
  time: {
    scaleType: 'time';
    scale: ScaleTime<any, any>;
  };
  utc: {
    scaleType: 'utc';
    scale: ScaleTime<any, any>;
  };
  linear: {
    scaleType: 'linear';
    scale: ScaleLinear<any, any>;
  };
}

export type AxisConfig<S extends ScaleName = ScaleName, V = any> = {
  id: string;
  min?: number | Date;
  max?: number | Date;
  data?: V[];
  /**
   * The key used to retrieve data from the dataset prop.
   */
  dataKey?: string;
  valueFormatter?: (value: V) => string;
  /**
   * If `true`, hide this value in the tooltip
   */
  hideTooltip?: boolean;
} & Partial<ChartsXAxisProps | ChartsYAxisProps> &
  Partial<Omit<AxisScaleConfig[S], 'scale'>> &
  TickParams;

export type AxisDefaultized<S extends ScaleName = ScaleName, V = any> = Omit<
  AxisConfig<S, V>,
  'scaleType'
> &
  AxisScaleConfig[S] & {
    ticksNumber: number;
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
