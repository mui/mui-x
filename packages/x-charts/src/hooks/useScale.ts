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
import { Scales } from '../models/axis';

export function getScale(scaleType: Scales | undefined) {
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

// function useScale(scaleType, domain, range) {
//   return getScale(scaleType).domain(domain).range(range);
// }

// export default useScale;
