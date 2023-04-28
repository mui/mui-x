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
      scaleName: 'band';
      scale: ScaleBand<any>;
    }
  | {
      scaleName: 'log';
      scale: ScaleLogarithmic<any, any>;
    }
  | {
      scaleName: 'point';
      scale: ScalePoint<any>;
    }
  | {
      scaleName: 'pow' | 'sqrt';
      scale: ScalePower<any, any>;
    }
  | {
      scaleName: 'time' | 'utc';
      scale: ScaleTime<any, any>;
    }
  | {
      scaleName: 'linear';
      scale: ScaleLinear<any, any>;
    };

export type AxisConfig<V = any> = {
  id: string;
  scaleName?: ScaleName;
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
