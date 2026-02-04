import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartCartesianAxesGap,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import type { DefaultedXAxis, DefaultedYAxis } from '../../../../models/axis';

function selectAxisSize(
  axes: DefaultedYAxis[] | undefined,
  axesGap: number,
  position: 'left' | 'right',
): number;
function selectAxisSize(
  axes: DefaultedXAxis[] | undefined,
  axesGap: number,
  position: 'top' | 'bottom',
): number;
function selectAxisSize(
  axes: DefaultedXAxis[] | DefaultedYAxis[] | undefined,
  axesGap: number,
  position: 'left' | 'right' | 'top' | 'bottom',
): number {
  let axesSize = 0;
  let nbOfAxes = 0;

  for (const axis of axes ?? []) {
    if (axis.position !== position) {
      continue;
    }
    const axisSize =
      position === 'top' || position === 'bottom'
        ? (axis as DefaultedXAxis).height
        : (axis as DefaultedYAxis).width;
    axesSize += (axisSize || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0);
    nbOfAxes += 1;
  }

  return axesSize + axesGap * Math.max(0, nbOfAxes - 1);
}

export const selectorChartLeftAxisSize = createSelector(
  selectorChartRawYAxis,
  selectorChartCartesianAxesGap,
  function selectorChartLeftAxisSize(yAxis, axesGap) {
    return selectAxisSize(yAxis, axesGap, 'left');
  },
);

export const selectorChartRightAxisSize = createSelector(
  selectorChartRawYAxis,
  selectorChartCartesianAxesGap,
  function selectorChartRightAxisSize(yAxis, axesGap) {
    return selectAxisSize(yAxis, axesGap, 'right');
  },
);

export const selectorChartTopAxisSize = createSelector(
  selectorChartRawXAxis,
  selectorChartCartesianAxesGap,
  function selectorChartTopAxisSize(xAxis, axesGap) {
    return selectAxisSize(xAxis, axesGap, 'top');
  },
);

export const selectorChartBottomAxisSize = createSelector(
  selectorChartRawXAxis,
  selectorChartCartesianAxesGap,
  function selectorChartBottomAxisSize(xAxis, axesGap) {
    return selectAxisSize(xAxis, axesGap, 'bottom');
  },
);

export const selectorChartAxisSizes = createSelectorMemoized(
  selectorChartLeftAxisSize,
  selectorChartRightAxisSize,
  selectorChartTopAxisSize,
  selectorChartBottomAxisSize,
  function selectorChartAxisSizes(left, right, top, bottom) {
    return {
      left,
      right,
      top,
      bottom,
    };
  },
);
