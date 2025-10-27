import {
  // eslint-disable-next-line no-restricted-imports
  scaleBand as d3ScaleBand,
  type NumberValue,
  type ScaleBand,
} from '@mui/x-charts-vendor/d3-scale';
import { ProxyArrayValueOf } from './ProxyArrayValueOf';
import { ProxyScaleDomain } from './ProxyScaleDomain';

/**
 * Constructs a new band scale with the specified range, no padding, no rounding and center alignment.
 * The domain defaults to the empty domain.
 * If range is not specified, it defaults to the unit range [0, 1].
 *
 * The generic corresponds to the data type of domain elements.
 *
 * @param range A two-element array of numeric values.
 */
export function scaleBand<Domain extends { toString(): string } = string>(
  range?: Iterable<NumberValue>,
): ScaleBand<Domain>;
/**
 * Constructs a new band scale with the specified domain and range, no padding, no rounding and center alignment.
 *
 * The generic corresponds to the data type of domain elements.
 *
 * @param domain Array of domain values.
 * @param range A two-element array of numeric values.
 */
export function scaleBand<Domain extends { toString(): string }>(
  domain: Iterable<Domain>,
  range: Iterable<NumberValue>,
): ScaleBand<Domain>;
export function scaleBand(...args: any[]) {
  const [arg0, arg1] = args;

  if (arg0 && arg1) {
    return ProxyScaleDomain(d3ScaleBand(ProxyArrayValueOf(arg0 as any) as any, arg1 as any));
  }

  if (arg0) {
    return ProxyScaleDomain(d3ScaleBand(arg0 as any));
  }

  return ProxyScaleDomain(d3ScaleBand());
}
