import { scaleLog, scalePow, scaleSqrt, scaleTime, scaleUtc, scaleLinear } from 'd3-scale';
import { ContinuouseScaleName, D3ContinuouseScale } from '../models/axis';

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
