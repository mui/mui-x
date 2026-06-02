import { type ChartSeriesSampler } from '@mui/x-charts/internals';
import { estimateVisibleFraction, targetForZoomLevel } from '../computeTargetCount';
import { normalizeIndices } from '../normalizeIndices';
import { bucketAggregate } from '../bucketAggregate';

/**
 * Computes the rendered indices for a bar series, dispatching on the `sampling` method (a built-in
 * string or a custom function).
 *
 * The whole series is bucketed into representatives, so the kept set is stable while panning. The
 * number of representatives is quantized to the zoom level, so zooming changes the resolution in
 * discrete steps rather than continuously. The plot hook then renders each representative at its
 * true scaled position, widened to fill the gap to its neighbor.
 *
 * Returns `null` when sampling is not set or would not reduce the rendered bar count.
 */
export const barSampler: ChartSeriesSampler<'bar'> = (
  series,
  { drawingArea, zoomLevel, xScale, yScale },
) => {
  const method = series.sampling;
  if (!method) {
    return null;
  }

  const length = series.data.length;
  const horizontal = series.layout === 'horizontal';
  const pixelSpan = horizontal ? drawingArea.height : drawingArea.width;
  const target = targetForZoomLevel(pixelSpan, zoomLevel, length);

  // Render every bar once the series fits, or once few enough remain visible (zoomed in): the plot
  // clips off-screen bars, so the visible ones render individually at the band scale's full width.
  const baseScale = horizontal ? yScale : xScale;
  if (length <= target || length * estimateVisibleFraction(baseScale, pixelSpan) <= target) {
    return null;
  }

  if (typeof method === 'function') {
    return normalizeIndices(
      method({
        length,
        target,
        zoomLevel,
        getValue: (index) => series.data[index] ?? 0,
        getPosition: (index) => index,
      }),
      length,
    );
  }

  return bucketAggregate(series.data, target);
};
