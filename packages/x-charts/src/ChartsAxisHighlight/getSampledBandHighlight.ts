import type { D3OrdinalScale } from '../models/axis';

interface SampledBandHighlightParams {
  scale: D3OrdinalScale;
  /** The highlighted value. */
  value: number | Date;
  /** The data index of the highlighted value, when known (O(1) lookup). */
  dataIndex: number | undefined;
  /** The axis data. */
  data: readonly any[] | undefined;
  /** The number of merged data points per band when the series is sampled. */
  bucketSize: number;
}

/**
 * Computes the band highlight rectangle along the ordinal axis.
 * When the series is sampled (`bucketSize > 1`), the band is widened to cover the whole merged bucket.
 */
export function getSampledBandHighlight({
  scale,
  value,
  dataIndex,
  data,
  bucketSize,
}: SampledBandHighlightParams): { bandStart: number; bandSize: number } {
  const step = scale.step();
  const halfPadding = (step - scale.bandwidth()) / 2;

  let bandStart = scale(value)! - halfPadding;
  let bandSize = step;

  if (bucketSize > 1 && data) {
    const index = dataIndex ?? data.indexOf(value);
    if (index >= 0) {
      const bucketStart = Math.floor(index / bucketSize) * bucketSize;
      const bucketEnd = Math.min(bucketStart + bucketSize - 1, data.length - 1);
      bandStart = scale(data[bucketStart])! - halfPadding;
      bandSize = (bucketEnd - bucketStart + 1) * step;
    }
  }

  return { bandStart, bandSize };
}
