import {
  scaleLog,
  scalePow,
  scaleSqrt,
  scaleTime,
  scaleUtc,
  scaleLinear,
} from '@mui/x-charts-vendor/d3-scale';
import { ContinuousScaleName, D3ContinuousScale } from '../models/axis';
import { scaleSymlog } from './symlogScale';

export function getScale(
  scaleType: ContinuousScaleName,
  domain: readonly any[],
  range: readonly any[],
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
    case 'symlog':
      return scaleSymlog(domain, range);
    default:
      return scaleLinear(domain, range);
  }
}
