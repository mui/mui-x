import type {
  ScaleBand,
  ScaleLogarithmic,
  ScalePoint,
  ScalePower,
  ScaleTime,
  ScaleLinear,
} from 'd3-scale';
import { DefaultizedProps } from './helpers';

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
   * The font size of the axis text.
   * @default 12
   */
  fontSize?: number;
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

export type ScaleName = 'linear' | 'band' | 'log' | 'point' | 'pow' | 'sqrt' | 'time' | 'utc';

export type AxisScaleMapping =
  | {
      scaleType: 'band';
      scale: ScaleBand<any>;
    }
  | {
      scaleType: 'log';
      scale: ScaleLogarithmic<any, any>;
    }
  | {
      scaleType: 'point';
      scale: ScalePoint<any>;
    }
  | {
      scaleType: 'pow' | 'sqrt';
      scale: ScalePower<any, any>;
    }
  | {
      scaleType: 'time' | 'utc';
      scale: ScaleTime<any, any>;
    }
  | {
      scaleType: 'linear';
      scale: ScaleLinear<any, any>;
    };

export type AxisConfig<V = any> = {
  id: string;
  scaleType?: ScaleName;
  min?: number;
  max?: number;
  data?: V[];
  valueFormatter?: (value: V) => string;
} & Partial<XAxisProps | YAxisProps>;

export type AxisDefaultized<V = any> = DefaultizedProps<AxisConfig<V>, 'scaleType'> &
  AxisScaleMapping;
