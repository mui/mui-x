'use client';
import { isBandScale } from '../internals/isBandScale';
import { D3Scale } from '../models/axis';

/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param scale The scale to use
 * @returns (value: any) => number
 */
export function getValueToPositionMapper(scale: D3Scale) {
  if (isBandScale(scale)) {
    return (value: any) => (scale(value) ?? 0) + scale.bandwidth() / 2;
  }
  return (value: any) => scale(value) as number;
}
