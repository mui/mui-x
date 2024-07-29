import {
  scaleLog,
  scalePow,
  scaleSqrt,
  scaleTime,
  scaleUtc,
  scaleLinear,
} from '@mui/x-charts-vendor/d3-scale';
import { ContinuousScaleName, D3ContinuousScale } from '../models/axis';

export function getScale(
  scaleType: ContinuousScaleName,
  domain: any[],
  range: any[],
): D3ContinuousScale {
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
