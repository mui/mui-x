import type { D3OrdinalScale, D3Scale } from '../models/axis';
import { getValueToPositionMapper } from '../hooks/getValueToPositionMapper';
import { isOrdinalScale } from './scaleGuards';

/**
 * Returns `index => band start` (not center) of `domain[index]` on an ordinal scale.
 * Unlike `scale(domain[index])`, duplicated values each resolve to their own band.
 * @param domain The scale domain, i.e. the axis `data`.
 */
export function getOrdinalBandStartMapper<Domain extends { toString(): string }>(
  scale: D3OrdinalScale<Domain>,
  domain: readonly Domain[],
): (index: number) => number | undefined {
  const length = domain.length;
  const first = length > 0 ? scale(domain[0]) : undefined;
  if (first === undefined) {
    return () => undefined;
  }
  const [r0, r1] = scale.range();
  const step = r1 < r0 ? -scale.step() : scale.step();
  return (index) => (index < 0 || index >= length ? undefined : first + index * step);
}

/**
 * Like `getValueToPositionMapper`, but maps a data index of `data`.
 * Ordinal scales return the band center, resolved by index so duplicated values get distinct positions.
 */
export function getIndexToPositionMapper<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
>(scale: D3Scale<Domain, Range>, data: readonly any[]): (index: number) => number {
  if (isOrdinalScale(scale)) {
    const getBandStart = getOrdinalBandStartMapper(scale, data);
    const offset = scale.bandwidth() / 2;
    return (index) => (getBandStart(index) ?? 0) + offset;
  }
  const toPosition = getValueToPositionMapper(scale);
  return (index) => toPosition(data[index]);
}
