import { type ChartSeriesSampler } from '@mui/x-charts/internals';
import { targetForZoomLevel } from '../computeTargetCount';
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
export const barSampler: ChartSeriesSampler<'bar'> = (series, { drawingArea, zoomLevel }) => {
  const method = series.sampling;
  if (!method) {
    return null;
  }

  const length = series.data.length;
  const horizontal = series.layout === 'horizontal';
  const pixelSpan = horizontal ? drawingArea.height : drawingArea.width;
  const target = targetForZoomLevel(pixelSpan, zoomLevel, length);

  // The whole series is bucketed to `target` representatives, which grows with the zoom level, so
  // zooming in adds bars in discrete steps. Once the series fits the target there is nothing to drop.
  if (length <= target) {
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
