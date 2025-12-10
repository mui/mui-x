import {
  scaleLog,
  scalePow,
  scaleSqrt,
  scaleTime,
  scaleUtc,
  scaleLinear,
  type NumberValue,
} from '@mui/x-charts-vendor/d3-scale';
import { type ContinuousScaleName, type D3ContinuousScale } from '../models/axis';
import { scaleSymlog } from './scales';

export function getScale<Domain extends NumberValue = any, Range = any>(
  scaleType: ContinuousScaleName,
  domain: Iterable<Domain>,
  range: readonly Range[],
): D3ContinuousScale<Range, Range> {
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
    case 'symlog':
      return scaleSymlog(domain, range);
    default:
      return scaleLinear(domain, range);
  }
}
