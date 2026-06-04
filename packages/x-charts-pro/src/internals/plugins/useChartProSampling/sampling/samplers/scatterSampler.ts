import { type ChartSeriesSampler } from '../sampler.types';
import { DEFAULT_PIXELS_PER_POINT } from '../computeTargetCount';
import { normalizeIndices } from '../normalizeIndices';

/**
 * Computes the rendered indices for a scatter series, dispatching on the `sampling` method (the
 * built-in `'bucket'` or a custom function).
 *
 * Sampling runs over the whole series in data space, so it does not change while panning. The grid
 * resolution (for `'bucket'`) and the target count (for a custom function) are quantized to the
 * zoom level, so zooming reveals more points in discrete steps. This keeps the point cloud stable
 * and flicker-free.
 *
 * Returns `null` when sampling is not set or would not reduce the rendered point count.
 */
export const scatterSampler: ChartSeriesSampler<'scatter'> = (
  series,
  { drawingArea, zoomLevel },
) => {
  const method = series.sampling;
  if (!method) {
    return null;
  }

  const data = series.data;
  const length = data.length;
  const levelFactor = 2 ** Math.max(0, zoomLevel);
  const countTarget = Math.min(
    length,
    Math.max(2, Math.floor(drawingArea.width / DEFAULT_PIXELS_PER_POINT)) * levelFactor,
  );

  if (length <= countTarget) {
    return null;
  }

  if (typeof method === 'function') {
    return normalizeIndices(
      method({
        length,
        target: countTarget,
        zoomLevel,
        getValue: (index) => data[index].y,
        getPosition: (index) => data[index].x,
      }),
      length,
    );
  }

  // Built-in `'bucket'`: keep one point per data-space grid cell. Runs in data space (not pixels)
  // so the kept set stays stable across pans.
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < length; i += 1) {
    minX = Math.min(minX, data[i].x);
    maxX = Math.max(maxX, data[i].x);
    minY = Math.min(minY, data[i].y);
    maxY = Math.max(maxY, data[i].y);
  }

  // Cells ~2x the mark: points within a marker's width of each other overlap, so collapsing them to
  // one stays visually faithful.
  const markSize = (series.markerSize > 0 ? series.markerSize : DEFAULT_PIXELS_PER_POINT) * 2;
  const cellsX = Math.max(1, (drawingArea.width / markSize) * levelFactor);
  const cellsY = Math.max(1, (drawingArea.height / markSize) * levelFactor);
  const cellSizeX = (maxX - minX || 1) / cellsX;
  const cellSizeY = (maxY - minY || 1) / cellsY;

  const seen = new Set<string>();
  const result: number[] = [];
  for (let i = 0; i < length; i += 1) {
    const key = `${Math.floor((data[i].x - minX) / cellSizeX)}|${Math.floor((data[i].y - minY) / cellSizeY)}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(i);
    }
  }

  return result.length >= length ? null : result;
};
