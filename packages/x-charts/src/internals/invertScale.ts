import { type D3OrdinalScale, type D3Scale } from '../models/axis';
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
  const dataIndex =
    scale.bandwidth() === 0
      ? Math.floor((value - Math.min(...scale.range()) + scale.step() / 2) / scale.step())
      : Math.floor((value - Math.min(...scale.range())) / scale.step());

  return dataIndex;
}
