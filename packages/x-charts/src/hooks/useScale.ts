import {
  scaleBand,
  scaleLog,
  scalePoint,
  scalePow,
  scaleSqrt,
  scaleTime,
  scaleUtc,
  scaleLinear,
} from 'd3-scale';
import type {
  ScaleBand,
  ScaleLogarithmic,
  ScalePoint,
  ScalePower,
  ScaleTime,
  ScaleLinear,
} from 'd3-scale';
import { ScaleName } from '../models/axis';

export type D3Scale =
  | ScaleBand<any>
  | ScaleLogarithmic<any, any>
  | ScalePoint<any>
  | ScalePower<any, any>
  | ScaleTime<any, any>
  | ScaleLinear<any, any>;

export function getScale(scaleName: ScaleName | undefined): D3Scale {
  switch (scaleName) {
    case 'band':
      return scaleBand();
    case 'log':
      return scaleLog();
    case 'point':
      return scalePoint();
    case 'pow':
      return scalePow();
    case 'sqrt':
      return scaleSqrt();
    case 'time':
      return scaleTime();
    case 'utc':
      return scaleUtc();
    default:
      return scaleLinear();
  }
}

export function isBandScale(scale: D3Scale): scale is ScaleBand<any> | ScalePoint<any> {
  return (scale as ScaleBand<any> | ScalePoint<any>).bandwidth !== undefined;
}
