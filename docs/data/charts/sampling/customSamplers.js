/**
 * A custom Min/Max sampler.
 *
 * It splits the series into buckets and keeps the index of the lowest and highest value of each
 * bucket, which preserves the vertical extent (peaks and spikes) of noisy signals. It is a plain
 * example of the {@link DataSampler} contract: given the series length, a target number of points,
 * and a `getValue` accessor, return the indices of the points to render.
 *
 * The function is deterministic (the same input always yields the same indices), so the chart does
 * not flicker while panning.
 */
export const minMaxSampler = ({ length, target, getValue }) => {
  const bucketCount = Math.max(1, Math.floor(target / 2));
  const bucketSize = length / bucketCount;
  const indices = [0, length - 1];

  for (let bucket = 0; bucket < bucketCount; bucket += 1) {
    const start = Math.floor(bucket * bucketSize);
    const end = Math.min(length, Math.floor((bucket + 1) * bucketSize));
    let min = start;
    let max = start;
    for (let i = start; i < end; i += 1) {
      if (getValue(i) < getValue(min)) {
        min = i;
      }
      if (getValue(i) > getValue(max)) {
        max = i;
      }
    }
    indices.push(min, max);
  }

  // The chart sorts and de-duplicates the returned indices, so the order here does not matter.
  return indices;
};
