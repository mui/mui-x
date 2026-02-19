'use client';
import { isOrdinalScale } from '../internals/scaleGuards';
import type { D3Scale } from '../models/axis';

/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param {D3Scale} scale The scale to use
 * @returns {(value: any) => number} A function that map value to their position
 */
export function getValueToPositionMapper<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
>(scale: D3Scale<Domain, Range>): (value: any) => number {
  if (isOrdinalScale(scale)) {
    return (value: any) => (scale(value) ?? 0) + scale.bandwidth() / 2;
  }

  const domain = scale.domain();

  // Fixes https://github.com/mui/mui-x/issues/18999#issuecomment-3173787401
  if (domain[0] === domain[1]) {
    return (value: any) => (value === domain[0] ? scale(value) : NaN);
  }

  return (value: any) => scale(value) as number;
}
