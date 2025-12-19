import { type NumberValue } from '@mui/x-charts-vendor/d3-scale';
import { type ContinuousScaleName } from '../models';
import { getScale } from '../internals/getScale';

/**
 * Returns a nice domain for the given scale type and domain.
 * Does not modify the original domain.
 *
 * Providing a count improves the nice domain calculation by trying to align tick values to round
 * numbers or dates.
 *
 * For example, if you have a domain of [29, 72] and there are 5 ticks, the nice domain will be
 * [20, 80] so that the ticks can be at [20, 35, 50, 65, 80].
 * However, if there are 11 ticks, the nice domain will be [25, 75] so that the ticks can be at
 * [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75].
 *
 * @param scaleType The type of the scale (e.g., 'linear', 'log', 'time', etc.).
 * @param domain The domain to be made nicer.
 * @param count An optional number of ticks to improve the nice domain calculation. Defaults to 5.
 */

export function niceDomain<Domain extends NumberValue>(
  scaleType: Exclude<ContinuousScaleName, 'time' | 'utc'>,
  domain: Iterable<Domain>,
  count?: number,
): Domain[];
export function niceDomain<Domain extends NumberValue>(
  scaleType: 'time' | 'utc',
  domain: Iterable<Domain>,
  count?: number,
): Date[];
export function niceDomain<Domain extends NumberValue>(
  scaleType: ContinuousScaleName,
  domain: Iterable<Domain>,
  count: number = 5,
): Domain[] {
  const scale = getScale(scaleType, domain, [0, 1]);
  scale.nice(count);

  return scale.domain() as Domain[];
}
