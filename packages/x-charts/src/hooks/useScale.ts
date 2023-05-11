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

export function getScale(scaleType: ScaleName | undefined): D3Scale {
  switch (scaleType) {
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

/**
 * For a given scale return a function that map value to their position.
 * Usefull when dealing with specific scale such as band.
 * @param scale The scale to use
 * @returns (value: any) => number
 */
export function getValueToPositionMapper(scale: D3Scale) {
  if (isBandScale(scale)) {
    return (value: any) => scale(value)! + scale.bandwidth() / 2;
  }
  return (value: any) => scale(value) as number;
}
