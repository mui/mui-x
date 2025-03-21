import { DefaultizedZoomOptions, ZoomData } from '@mui/x-charts/internals';

/**
 * Helper to get the range (in percents of a reference range) corresponding to a given scale.
 * @param centerRatio {number} The ratio of the point that should not move between the previous and next range.
 * @param scaleRatio {number} The target scale ratio.
 * @returns The range to display.
 */
export const zoomAtPoint = (
  centerRatio: number,
  scaleRatio: number,
  currentZoomData: ZoomData,
  options: DefaultizedZoomOptions,
) => {
  const MIN_RANGE = options.minStart;
  const MAX_RANGE = options.maxEnd;

  const MIN_ALLOWED_SPAN = options.minSpan;

  const minRange = currentZoomData.start;
  const maxRange = currentZoomData.end;

  const point = minRange + centerRatio * (maxRange - minRange);

  let newMinRange = (minRange + point * (scaleRatio - 1)) / scaleRatio;
  let newMaxRange = (maxRange + point * (scaleRatio - 1)) / scaleRatio;

  let minSpillover = 0;
  let maxSpillover = 0;

  if (newMinRange < MIN_RANGE) {
    minSpillover = Math.abs(newMinRange);
    newMinRange = MIN_RANGE;
  }
  if (newMaxRange > MAX_RANGE) {
    maxSpillover = Math.abs(newMaxRange - MAX_RANGE);
    newMaxRange = MAX_RANGE;
  }

  if (minSpillover > 0 && maxSpillover > 0) {
    return [MIN_RANGE, MAX_RANGE];
  }

  newMaxRange += minSpillover;
  newMinRange -= maxSpillover;

  newMinRange = Math.min(MAX_RANGE - MIN_ALLOWED_SPAN, Math.max(MIN_RANGE, newMinRange));
  newMaxRange = Math.max(MIN_ALLOWED_SPAN, Math.min(MAX_RANGE, newMaxRange));

  return [newMinRange, newMaxRange];
};

/**
 * Checks if the new span is valid.
 */
export function isSpanValid(
  minRange: number,
  maxRange: number,
  isZoomIn: boolean,
  option: DefaultizedZoomOptions,
) {
  const newSpanPercent = maxRange - minRange;

  if (
    (isZoomIn && newSpanPercent < option.minSpan) ||
    (!isZoomIn && newSpanPercent > option.maxSpan)
  ) {
    return false;
  }

  if (minRange < option.minStart || maxRange > option.maxEnd) {
    return false;
  }

  return true;
}

function getMultiplier(event: WheelEvent) {
  const ctrlMultiplier = event.ctrlKey ? 3 : 1;

  // DeltaMode: 0 is pixel, 1 is line, 2 is page
  // This is defined by the browser.
  if (event.deltaMode === 1) {
    return 1 * ctrlMultiplier;
  }
  if (event.deltaMode) {
    return 10 * ctrlMultiplier;
  }
  return 0.2 * ctrlMultiplier;
}

/**
 * Get the scale ratio and if it's a zoom in or out from a wheel event.
 */
export function getWheelScaleRatio(event: WheelEvent, step: number) {
  const deltaY = -event.deltaY;
  const multiplier = getMultiplier(event);
  const scaledStep = (step * multiplier * deltaY) / 1000;
  // Clamp the scale ratio between 0.1 and 1.9 so that the zoom is not too big or too small.
  const scaleRatio = Math.min(Math.max(1 + scaledStep, 0.1), 1.9);
  const isZoomIn = deltaY > 0;
  return { scaleRatio, isZoomIn };
}

/**
 * Get the ratio of the point in the horizontal center of the area.
 */
export function getHorizontalCenterRatio(
  point: { x: number; y: number },
  area: { left: number; width: number },
) {
  const { left, width } = area;
  return (point.x - left) / width;
}

export function getVerticalCenterRatio(
  point: { x: number; y: number },
  area: { top: number; height: number },
) {
  const { top, height } = area;
  return ((point.y - top) / height) * -1 + 1;
}
