import {
  AxisId,
  ChartState,
  DefaultedXAxis,
  DefaultedYAxis,
  DefaultizedZoomOptions,
  selectorChartAxisZoomOptionsLookup,
  selectorChartDrawingArea,
  selectorChartRawAxis,
  ZoomData,
} from '@mui/x-charts/internals';
import { ChartDrawingArea } from '@mui/x-charts/hooks';

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
  axis: Pick<DefaultedXAxis | DefaultedYAxis, 'position' | 'reverse'>,
  zoomOptions: DefaultizedZoomOptions,
  point: DOMPoint,
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

  if (axis.reverse) {
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
