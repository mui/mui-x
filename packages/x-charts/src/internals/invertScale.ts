import type { D3OrdinalScale, D3Scale } from '../models/axis';
import { isOrdinalScale } from './scaleGuards';

export function invertScale<T>(scale: D3Scale, data: readonly T[], value: number) {
  if (isOrdinalScale(scale)) {
    const dataIndex = getDataIndexForOrdinalScaleValue(scale, value);

    return data[dataIndex];
  }

  return scale.invert(value);
}

/**
 * Get the data index for a given value on an ordinal scale.
 */
export function getDataIndexForOrdinalScaleValue(scale: D3OrdinalScale, value: number) {
  const [r0, r1] = scale.range();
  // Measure from the range start, which holds the first item even when the range is descending.
  const offset = r1 < r0 ? r0 - value : value - r0;

  return scale.bandwidth() === 0
    ? Math.floor((offset + scale.step() / 2) / scale.step())
    : Math.floor(offset / scale.step());
}
