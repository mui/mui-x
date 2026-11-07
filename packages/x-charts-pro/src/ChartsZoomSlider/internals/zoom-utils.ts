import {
  selectorChartAxisZoomOptionsLookup,
  selectorChartDrawingArea,
  selectorChartRawAxis,
} from '@mui/x-charts/internals';
import type {
  AxisId,
  ChartState,
  DefaultedXAxis,
  DefaultedYAxis,
  DefaultizedZoomOptions,
  ZoomData,
} from '@mui/x-charts/internals';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';

/**
 * Whether the zoom range runs in the opposite direction of the slider's default one, which is
 * left to right for the x-axis and bottom to top for the y-axis.
 *
 * Ordinal y-axes need a special case: they draw their first value at the top, so the default
 * direction of their zoom range is already reversed.
 */
export function isZoomSliderReversed(
  axis: Pick<DefaultedXAxis | DefaultedYAxis, 'position' | 'reverse' | 'scaleType'>,
) {
  const isYAxis = axis.position === 'left' || axis.position === 'right';
  const isOrdinal = axis.scaleType === 'band' || axis.scaleType === 'point';
  const reverse = axis.reverse ?? false;

  return isYAxis && isOrdinal ? !reverse : reverse;
}

export function calculateZoomFromPoint(state: ChartState<any>, axisId: AxisId, point: DOMPoint) {
  const axis = selectorChartRawAxis(state, axisId);

  if (!axis) {
    return null;
  }

  return calculateZoomFromPointImpl(
    selectorChartDrawingArea(state),
    axis,
    selectorChartAxisZoomOptionsLookup(state, axisId),
    point,
  );
}

export function calculateZoomFromPointImpl(
  drawingArea: ChartDrawingArea,
  axis: Pick<DefaultedXAxis | DefaultedYAxis, 'position' | 'reverse' | 'scaleType'>,
  zoomOptions: Pick<DefaultizedZoomOptions, 'minStart' | 'maxEnd'>,
  point: Pick<DOMPoint, 'x' | 'y'>,
) {
  const { left, top, height, width } = drawingArea;
  const { minStart, maxEnd } = zoomOptions;

  const axisDirection = axis.position === 'right' || axis.position === 'left' ? 'y' : 'x';
  const range = maxEnd - minStart;

  let pointerZoom: number;
  if (axisDirection === 'x') {
    pointerZoom = ((point.x - left) / width) * range;
  } else {
    pointerZoom = ((top + height - point.y) / height) * range;
  }

  if (isZoomSliderReversed(axis)) {
    pointerZoom = maxEnd - pointerZoom;
  } else {
    pointerZoom += minStart;
  }

  return pointerZoom;
}

export function calculateZoomStart(
  newStart: number,
  currentZoom: ZoomData,
  options: Pick<DefaultizedZoomOptions, 'minStart' | 'minSpan' | 'maxSpan'>,
) {
  const { minStart, minSpan, maxSpan } = options;

  return Math.max(
    minStart,
    currentZoom.end - maxSpan,
    Math.min(currentZoom.end - minSpan, newStart),
  );
}

export function calculateZoomEnd(
  newEnd: number,
  currentZoom: ZoomData,
  options: Pick<DefaultizedZoomOptions, 'maxEnd' | 'minSpan' | 'maxSpan'>,
) {
  const { maxEnd, minSpan, maxSpan } = options;

  return Math.min(
    maxEnd,
    currentZoom.start + maxSpan,
    Math.max(currentZoom.start + minSpan, newEnd),
  );
}
