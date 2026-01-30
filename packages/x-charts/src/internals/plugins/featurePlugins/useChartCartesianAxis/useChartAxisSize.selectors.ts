import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartCartesianAxesGap,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import {
  selectorChartXAxisAutoSizes,
  selectorChartYAxisAutoSizes,
} from './useChartAxisAutoSize.selectors';
import type { AxisId, DefaultedXAxis, DefaultedYAxis } from '../../../../models/axis';
import {
  DEFAULT_AXIS_SIZE_HEIGHT,
  DEFAULT_AXIS_SIZE_WIDTH,
  AXIS_LABEL_DEFAULT_HEIGHT,
} from '../../../../constants';

/**
 * Returns the default fallback height for an X axis when auto-sizing is not available.
 * This function ensures consistent fallback values between axis size calculation and rendering.
 */
export function getDefaultXAxisHeight(axis: DefaultedXAxis): number {
  return DEFAULT_AXIS_SIZE_HEIGHT + (axis.label ? AXIS_LABEL_DEFAULT_HEIGHT : 0);
}

/**
 * Returns the default fallback width for a Y axis when auto-sizing is not available.
 * This function ensures consistent fallback values between axis size calculation and rendering.
 */
export function getDefaultYAxisWidth(axis: DefaultedYAxis): number {
  return DEFAULT_AXIS_SIZE_WIDTH + (axis.label ? AXIS_LABEL_DEFAULT_HEIGHT : 0);
}

function selectXAxisSize(
  axes: DefaultedXAxis[] | undefined,
  axesGap: number,
  position: 'top' | 'bottom',
  autoSizes: Record<AxisId, number>,
): number {
  let axesSize = 0;
  let nbOfAxes = 0;

  for (const axis of axes ?? []) {
    if (axis.position !== position) {
      continue;
    }

    let axisSize: number;
    if (axis.height === 'auto') {
      // Use computed auto-size, or fall back to default
      axisSize = autoSizes[axis.id] ?? getDefaultXAxisHeight(axis);
    } else {
      axisSize = axis.height ?? 0;
    }

    axesSize += axisSize + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0);
    nbOfAxes += 1;
  }

  return axesSize + axesGap * Math.max(0, nbOfAxes - 1);
}

function selectYAxisSize(
  axes: DefaultedYAxis[] | undefined,
  axesGap: number,
  position: 'left' | 'right',
  autoSizes: Record<AxisId, number>,
): number {
  let axesSize = 0;
  let nbOfAxes = 0;

  for (const axis of axes ?? []) {
    if (axis.position !== position) {
      continue;
    }

    let axisSize: number;
    if (axis.width === 'auto') {
      // Use computed auto-size, or fall back to default
      axisSize = autoSizes[axis.id] ?? getDefaultYAxisWidth(axis);
    } else {
      axisSize = axis.width ?? 0;
    }

    axesSize += axisSize + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0);
    nbOfAxes += 1;
  }

  return axesSize + axesGap * Math.max(0, nbOfAxes - 1);
}

export const selectorChartLeftAxisSize = createSelector(
  selectorChartRawYAxis,
  selectorChartCartesianAxesGap,
  selectorChartYAxisAutoSizes,
  function selectorChartLeftAxisSize(yAxis, axesGap, autoSizes) {
    return selectYAxisSize(yAxis, axesGap, 'left', autoSizes);
  },
);

export const selectorChartRightAxisSize = createSelector(
  selectorChartRawYAxis,
  selectorChartCartesianAxesGap,
  selectorChartYAxisAutoSizes,
  function selectorChartRightAxisSize(yAxis, axesGap, autoSizes) {
    return selectYAxisSize(yAxis, axesGap, 'right', autoSizes);
  },
);

export const selectorChartTopAxisSize = createSelector(
  selectorChartRawXAxis,
  selectorChartCartesianAxesGap,
  selectorChartXAxisAutoSizes,
  function selectorChartTopAxisSize(xAxis, axesGap, autoSizes) {
    return selectXAxisSize(xAxis, axesGap, 'top', autoSizes);
  },
);

export const selectorChartBottomAxisSize = createSelector(
  selectorChartRawXAxis,
  selectorChartCartesianAxesGap,
  selectorChartXAxisAutoSizes,
  function selectorChartBottomAxisSize(xAxis, axesGap, autoSizes) {
    return selectXAxisSize(xAxis, axesGap, 'bottom', autoSizes);
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
