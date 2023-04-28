import type {
  ScaleBand,
  ScaleLogarithmic,
  ScalePoint,
  ScalePower,
  ScaleTime,
  ScaleLinear,
} from 'd3-scale';

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
};

export type AxisDefaultized<V = any> = {
  id: string;
  min?: number;
  max?: number;
  data?: V[];
  valueFormatter?: (value: V) => string;
} & AxisScaleMapping;
