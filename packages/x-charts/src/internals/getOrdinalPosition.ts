import type { D3OrdinalScale, D3Scale } from '../models/axis';
import { getValueToPositionMapper } from '../hooks/getValueToPositionMapper';
import { isOrdinalScale } from './scaleGuards';

/**
 * Start position of `domain[index]` on an ordinal scale.
 * Unlike `scale(domain[index])`, duplicated values each resolve to their own band.
 * @param domain The scale domain, i.e. the axis `data`.
 */
export function getOrdinalPosition<Domain extends { toString(): string }>(
  scale: D3OrdinalScale<Domain>,
  domain: readonly Domain[],
  index: number,
): number | undefined {
  if (index < 0 || index >= domain.length) {
    return undefined;
  }
  const start = scale(domain[0]);
  if (start === undefined) {
    return undefined;
  }
  const [r0, r1] = scale.range();
  return start + (r1 < r0 ? -index : index) * scale.step();
}

/**
 * Like `getValueToPositionMapper`, but maps a data index of `data`.
 * Ordinal scales resolve by index, so duplicated values get distinct positions.
 */
export function getIndexToPositionMapper<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
>(scale: D3Scale<Domain, Range>, data: readonly any[]): (index: number) => number {
  if (isOrdinalScale(scale)) {
    const offset = scale.bandwidth() / 2;
    return (index) => (getOrdinalPosition(scale, data, index) ?? 0) + offset;
  }
  const toPosition = getValueToPositionMapper(scale);
  return (index) => toPosition(data[index]);
}
