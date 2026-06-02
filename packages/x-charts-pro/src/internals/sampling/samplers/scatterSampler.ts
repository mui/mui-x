import { type ChartSeriesSampler } from '@mui/x-charts/internals';
import { DEFAULT_PIXELS_PER_POINT, estimateVisibleFraction } from '../computeTargetCount';
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
  { drawingArea, zoomLevel, xScale, yScale },
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

  // Render every point once few enough remain visible (zoomed into a small enough region of the
  // cloud): the plot clips what is off-screen, so this shows the full visible data at that point.
  const visibleFraction =
    estimateVisibleFraction(xScale, drawingArea.width) *
    estimateVisibleFraction(yScale, drawingArea.height);
  if (length * visibleFraction <= countTarget) {
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

  // Built-in `'bucket'`: build a data-space grid whose resolution grows with the zoom level. Keeping
  // one point per cell mirrors collapsing points that would share a pixel, but stays stable across
  // pans.
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

  // Size the grid to ~2x the mark: points within a marker's width of each other overlap, so
  // collapsing them to one per cell stays visually faithful while meaningfully reducing the count.
  // Smaller marks keep more points; larger marks keep fewer.
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
