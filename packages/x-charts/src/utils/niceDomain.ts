import { NumberValue } from '@mui/x-charts-vendor/d3-scale';
import { ContinuousScaleName } from '../models';
import { getScale } from '../internals/getScale';

/**
 * Returns a nice domain for the given scale type and domain.
 * Does not modify the original domain.
 */
export function niceDomain<Domain extends NumberValue>(
  scaleType: ContinuousScaleName,
  domain: Iterable<Domain>,
): number[] | Date[] {
  const scale = getScale<Domain, any>(scaleType, domain, [0, 1]);

  scale.nice();
  return scale.domain();
}
