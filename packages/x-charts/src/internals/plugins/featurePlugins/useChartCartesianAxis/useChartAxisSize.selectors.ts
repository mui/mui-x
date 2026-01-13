import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartCartesianAxesGap,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';

export const selectorChartLeftAxisSize = createSelector(
  selectorChartRawYAxis,
  selectorChartCartesianAxesGap,
  function selectorChartLeftAxisSize(yAxis, axesGap) {
    const visibleAxes = (yAxis ?? []).filter((axis) => axis.position === 'left');
    return (
      visibleAxes.reduce(
        (acc, axis) =>
          acc + (axis.width || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0),
        0,
      ) +
      axesGap * Math.max(0, visibleAxes.length - 1)
    );
  },
);

export const selectorChartRightAxisSize = createSelector(
  selectorChartRawYAxis,
  selectorChartCartesianAxesGap,
  function selectorChartRightAxisSize(yAxis, axesGap) {
    const visibleAxes = (yAxis ?? []).filter((axis) => axis.position === 'right');
    return (
      visibleAxes.reduce(
        (acc, axis) =>
          acc + (axis.width || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0),
        0,
      ) +
      axesGap * Math.max(0, visibleAxes.length - 1)
    );
  },
);

export const selectorChartTopAxisSize = createSelector(
  selectorChartRawXAxis,
  selectorChartCartesianAxesGap,
  function selectorChartTopAxisSize(xAxis, axesGap) {
    const visibleAxes = (xAxis ?? []).filter((axis) => axis.position === 'top');

    return (
      visibleAxes.reduce(
        (acc, axis) =>
          acc + (axis.height || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0),
        0,
      ) +
      axesGap * Math.max(0, visibleAxes.length - 1)
    );
  },
);

export const selectorChartBottomAxisSize = createSelector(
  selectorChartRawXAxis,
  selectorChartCartesianAxesGap,
  function selectorChartBottomAxisSize(xAxis, axesGap) {
    const visibleAxes = (xAxis ?? []).filter((axis) => axis.position === 'bottom');

    return (
      visibleAxes.reduce(
        (acc, axis) =>
          acc + (axis.height || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0),
        0,
      ) +
      axesGap * Math.max(0, visibleAxes.length - 1)
    );
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
