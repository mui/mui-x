import type {
  ScaleBand,
  ScaleLogarithmic,
  ScalePower,
  ScaleTime,
  ScaleLinear,
  ScalePoint,
} from 'd3-scale';
import { AxisClasses } from '../Axis/axisClasses';
import type { TickParams } from '../hooks/useTicks';

export interface AxisProps {
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
  classes?: Partial<AxisClasses>;
}

export interface YAxisProps extends AxisProps {
  /**
   * Position of the axis.
   */
  position?: 'left' | 'right';
}

export interface XAxisProps extends AxisProps {
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
    ticksNumber: number;
  };
  point: {
    scaleType: 'point';
    scale: ScalePoint<any>;
    ticksNumber: number;
  };
  log: {
    scaleType: 'log';
    scale: ScaleLogarithmic<any, any>;
    ticksNumber: number;
  };
  pow: {
    scaleType: 'pow';
    scale: ScalePower<any, any>;
    ticksNumber: number;
  };
  sqrt: {
    scaleType: 'sqrt';
    scale: ScalePower<any, any>;
    ticksNumber: number;
  };
  time: {
    scaleType: 'time';
    scale: ScaleTime<any, any>;
    ticksNumber: number;
  };
  utc: {
    scaleType: 'utc';
    scale: ScaleTime<any, any>;
    ticksNumber: number;
  };
  linear: {
    scaleType: 'linear';
    scale: ScaleLinear<any, any>;
    ticksNumber: number;
  };
}

export type AxisConfig<S = ScaleName, V = any> = {
  id: string;
  scaleType?: S;
  min?: number;
  max?: number;
  data?: V[];
  valueFormatter?: (value: V) => string;
} & Partial<XAxisProps | YAxisProps> &
  TickParams;

export type AxisDefaultized<S extends ScaleName = ScaleName, V = any> = Omit<
  AxisConfig<S, V>,
  'scaleType'
> &
  AxisScaleConfig[S];
