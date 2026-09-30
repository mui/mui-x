import type { D3OrdinalScale } from '../models/axis';

/**
 * Computes the band region covered by a sampled bucket spanning `data[startIndex..endIndex]`.
 *
 * The region is anchored at its left-most slot and spans whole steps, so both the rendered bar
 * (see `createGetBucketBarDimensions`) and the axis highlight (see `getSampledBandHighlight`)
 * stay in sync — on a reversed axis `startIndex` maps to the right, hence the `Math.min`.
 */
export function getSampledBucketRegion(
  scale: D3OrdinalScale,
  data: readonly any[],
  startIndex: number,
  endIndex: number,
): { regionStart: number; regionSize: number } {
  const step = scale.step();
  const halfPadding = (step - scale.bandwidth()) / 2;

  const startPos = scale(data[startIndex])!;
  const endPos = scale(data[endIndex])!;

  return {
    regionStart: Math.min(startPos, endPos) - halfPadding,
    regionSize: (endIndex - startIndex + 1) * step,
  };
}
