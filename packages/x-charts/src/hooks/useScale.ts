import { scaleLog, scalePow, scaleSqrt, scaleTime, scaleUtc, scaleLinear } from 'd3-scale';
import type {
  ScaleBand,
  ScaleLogarithmic,
  ScalePoint,
  ScalePower,
  ScaleTime,
  ScaleLinear,
} from 'd3-scale';
import { ContinuouseScaleName } from '../models/axis';

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

export function getScale(
  scaleType: ContinuouseScaleName,
  domain: any[],
  range: any[],
): D3ContinuouseScale {
  switch (scaleType) {
    case 'log':
      return scaleLog(domain, range);
    case 'pow':
      return scalePow(domain, range);
    case 'sqrt':
      return scaleSqrt(domain, range);
    case 'time':
      return scaleTime(domain, range);
    case 'utc':
      return scaleUtc(domain, range);
    default:
      return scaleLinear(domain, range);
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
