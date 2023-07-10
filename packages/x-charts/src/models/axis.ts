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

export interface ChartsAxisProps {
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
  min?: number;
  max?: number;
  data?: V[];
  valueFormatter?: (value: V) => string;
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
