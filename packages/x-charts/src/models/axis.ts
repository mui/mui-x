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

export type AxisConfig = {
  id: string;
  scaleName?: ScaleName;
  min?: number;
  max?: number;
  data?: any[];
};

export type AxisDefaultized = {
  id: string;
  min?: number;
  max?: number;
  data?: any[];
} & AxisScaleMapping;
