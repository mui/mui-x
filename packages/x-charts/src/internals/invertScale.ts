import { D3Scale } from '../models/axis';
import { isOrdinalScale } from './scaleGuards';

export function invertScale<T>(scale: D3Scale, data: readonly T[], value: number) {
  if (isOrdinalScale(scale)) {
    const dataIndex =
      scale.bandwidth() === 0
        ? Math.floor((value - Math.min(...scale.range()) + scale.step() / 2) / scale.step())
        : Math.floor((value - Math.min(...scale.range())) / scale.step());

    return data[dataIndex];
  }

  return scale.invert(value);
}
