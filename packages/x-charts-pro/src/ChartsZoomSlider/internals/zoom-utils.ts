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
import { ZOOM_SLIDER_KEYBOARD_LARGE_STEP, ZOOM_SLIDER_KEYBOARD_STEP } from './constants';

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
  axis: Pick<DefaultedXAxis | DefaultedYAxis, 'position'>,
  zoomOptions: Pick<DefaultizedZoomOptions, 'minStart' | 'maxEnd' | 'reverse'>,
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

  if (zoomOptions.reverse) {
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

/**
 * The zoom change bound to a key pressed on a zoom slider handle or track, or `null` when the key
 * is not bound.
 *
 * The arrow and page keys follow the slider on screen: right and up move towards the right or the
 * top, even when `reverse` makes that the start of the axis. `Home` and `End` go to the minimum and
 * the maximum, like on a native range input.
 * Modified keys are left to the browser, and to the keyboard zoom and pan of the chart.
 * @param {Pick<KeyboardEvent, 'key' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>} event The key press.
 * @param {boolean} reverse Whether the zoom slider is reversed.
 * @returns {number | null} The change to apply to the zoom, in percent of the axis extent.
 */
export function getZoomSliderKeyMovement(
  event: Pick<KeyboardEvent, 'key' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>,
  reverse: boolean,
): number | null {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return null;
  }

  let movement: number;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      movement = ZOOM_SLIDER_KEYBOARD_STEP;
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      movement = -ZOOM_SLIDER_KEYBOARD_STEP;
      break;
    case 'PageUp':
      movement = ZOOM_SLIDER_KEYBOARD_LARGE_STEP;
      break;
    case 'PageDown':
      movement = -ZOOM_SLIDER_KEYBOARD_LARGE_STEP;
      break;
    case 'Home':
      return -Infinity;
    case 'End':
      return Infinity;
    default:
      return null;
  }

  return reverse ? -movement : movement;
}
