import type { NumberValue, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { scaleBand } from './scaleBand';

/**
 * Constructs a new point scale with the specified range, no padding, no rounding and center alignment.
 * The domain defaults to the empty domain.
 * If range is not specified, it defaults to the unit range [0, 1].
 *
 * The generic corresponds to the data type of domain elements.
 *
 * @param range A two-element array of numeric values.
 */
export function scalePoint<Domain extends { toString(): string } = string>(
  range?: Iterable<NumberValue>,
): ScalePoint<Domain>;
/**
 * Constructs a new point scale with the specified domain and range, no padding, no rounding and center alignment.
 * The domain defaults to the empty domain.
 *
 * The generic corresponds to the data type of domain elements.
 *
 * @param domain Array of domain values.
 * @param range A two-element array of numeric values.
 */
export function scalePoint<Domain extends { toString(): string }>(
  domain: Iterable<Domain>,
  range: Iterable<NumberValue>,
): ScalePoint<Domain>;
export function scalePoint(...args: any[]): ScalePoint<any> {
  // ScalePoint is essentially ScaleBand with paddingInner(1)
  const scale: any = scaleBand(...args).paddingInner(1);

  // Remove paddingInner method and make padding alias to paddingOuter
  const originalCopy = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = () => {
    const copied = originalCopy();
    copied.padding = copied.paddingOuter;
    delete copied.paddingInner;
    delete copied.paddingOuter;
    copied.copy = scale.copy;
    return copied;
  };

  return scale;
}
