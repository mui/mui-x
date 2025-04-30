import { DefaultizedZoomOptions, ZoomData } from '@mui/x-charts/internals';

/**
 * Calculates the new zoom range based on the current zoom, step, and constraints.
 * @param zoom Current zoom range with start and end values.
 * @param step Percentage of the current zoom range to adjust (positive to zoom in, negative to zoom out). Ranges from 0 to 1.
 * @param minSpan Minimum allowed span between start and end values.
 * @param maxSpan Maximum allowed span between start and end values.
 * @param minStart Minimum allowed start value.
 * @param maxEnd Maximum allowed end value.
 */
export function calculateZoom<T extends Readonly<Pick<ZoomData, 'start' | 'end'>>>(
  zoom: T,
  step: number,
  {
    minSpan,
    maxSpan,
    minStart,
    maxEnd,
  }: Pick<DefaultizedZoomOptions, 'minSpan' | 'maxSpan' | 'minStart' | 'maxEnd'>,
) {
  const span = zoom.end - zoom.start;
  let delta = (span * step) / 2;

  if (delta > 0) {
    delta = Math.min(delta, (span - minSpan) / 2);
  } else {
    delta = Math.max(delta, (span - maxSpan) / 2);
  }

  return {
    ...zoom,
    start: Math.max(minStart, zoom.start + delta),
    end: Math.min(maxEnd, zoom.end - delta),
  };
}
