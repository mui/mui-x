import type { D3OrdinalScale } from '../models/axis';
import { getSampledBucketRegion } from '../internals/getSampledBucketRegion';

function findDataIndex(data: readonly unknown[], value: unknown): number {
  if (value instanceof Date) {
    const time = value.getTime();
    return data.findIndex((item) => item instanceof Date && item.getTime() === time);
  }
  return data.indexOf(value);
}

interface SampledBandHighlightParams {
  scale: D3OrdinalScale;
  /** The highlighted value. */
  value: string | number | Date;
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
    const index = dataIndex ?? findDataIndex(data, value);
    if (index >= 0) {
      const bucketStart = Math.floor(index / bucketSize) * bucketSize;
      const bucketEnd = Math.min(bucketStart + bucketSize - 1, data.length - 1);
      const { regionStart, regionSize } = getSampledBucketRegion(
        scale,
        data,
        bucketStart,
        bucketEnd,
      );
      bandStart = regionStart;
      bandSize = regionSize;
    }
  }

  return { bandStart, bandSize };
}
