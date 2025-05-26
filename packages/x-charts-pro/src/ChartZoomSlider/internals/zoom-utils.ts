import {
  AxisId,
  ChartState,
  DefaultizedZoomOptions,
  selectorChartDrawingArea,
  selectorChartRawAxis,
  ZoomData,
} from '@mui/x-charts/internals';

export function calculateZoomFromPoint(state: ChartState<any>, axisId: AxisId, point: DOMPoint) {
  const { left, top, height, width } = selectorChartDrawingArea(state);
  const axis = selectorChartRawAxis(state, axisId);

  if (!axis) {
    return null;
  }

  const axisDirection = axis.position === 'right' || axis.position === 'left' ? 'y' : 'x';

  let pointerZoom: number;
  if (axisDirection === 'x') {
    pointerZoom = ((point.x - left) / width) * 100;
  } else {
    pointerZoom = ((top + height - point.y) / height) * 100;
  }

  if (axis.reverse) {
    pointerZoom = 100 - pointerZoom;
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
