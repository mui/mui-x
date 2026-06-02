import { type ChartSeriesSampler } from '@mui/x-charts/internals';
import { estimateVisibleFraction, targetForZoomLevel } from '../computeTargetCount';
import { normalizeIndices } from '../normalizeIndices';
import { lttb } from '../lttb';
import { m4 } from '../m4';

/**
 * Computes the rendered indices for a line series, dispatching on the `sampling` method (a built-in
 * string or a custom function).
 *
 * The whole series is sampled (not just the visible part) so panning never changes the kept set.
 * The target count is quantized to the zoom level, so zooming adds detail in discrete steps. The
 * built-in methods run in data space and do not depend on the live scale — together this keeps the
 * line shape stable and flicker-free during zoom and pan.
 *
 * Returns `null` when sampling is not set or would not reduce the rendered point count.
 */
export const lineSampler: ChartSeriesSampler<'line'> = (
  series,
  { drawingArea, zoomLevel, xScale, xData },
) => {
  const method = series.sampling;
  if (!method) {
    return null;
  }

  const stacked = series.visibleStackedData;
  const length = stacked?.length ?? series.data.length;
  const target = targetForZoomLevel(drawingArea.width, zoomLevel, length);

  // Render everything once the series fits, or once few enough points remain visible (zoomed in):
  // the plot clips what is off-screen, so this shows every visible point at full detail.
  if (length <= target || length * estimateVisibleFraction(xScale, drawingArea.width) <= target) {
    return null;
  }

  const getXValue = (index: number) =>
    xData && typeof xData[index] === 'number' ? (xData[index] as number) : index;

  if (typeof method === 'function') {
    return normalizeIndices(
      method({
        length,
        target,
        zoomLevel,
        getValue: (index) => stacked[index][1],
        getPosition: getXValue,
      }),
      length,
    );
  }

  switch (method) {
    case 'm4':
      // Up to 4 points per column, so use a quarter of the target as the column count.
      return m4(
        stacked.map((point) => point[1]),
        Math.max(2, Math.floor(target / 4)),
      );
    case 'lttb':
    default: {
      const xValues: number[] = new Array(length);
      const yValues: number[] = new Array(length);
      for (let i = 0; i < length; i += 1) {
        xValues[i] = getXValue(i);
        yValues[i] = stacked[i][1];
      }
      return lttb(xValues, yValues, target);
    }
  }
};
