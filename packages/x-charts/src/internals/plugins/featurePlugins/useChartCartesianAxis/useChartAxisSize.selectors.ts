import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';

export const selectorChartLeftAxisSize = createSelectorMemoized(
  selectorChartRawYAxis,
  function selectorChartLeftAxisSize(yAxis) {
    return (yAxis ?? []).reduce(
      (acc, axis) =>
        axis.position === 'left'
          ? acc + (axis.width || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0)
          : acc,
      0,
    );
  },
);

export const selectorChartRightAxisSize = createSelectorMemoized(
  selectorChartRawYAxis,
  function selectorChartRightAxisSize(yAxis) {
    return (yAxis ?? []).reduce(
      (acc, axis) =>
        axis.position === 'right'
          ? acc + (axis.width || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0)
          : acc,
      0,
    );
  },
);

export const selectorChartTopAxisSize = createSelectorMemoized(
  selectorChartRawXAxis,
  function selectorChartTopAxisSize(xAxis) {
    return (xAxis ?? []).reduce(
      (acc, axis) =>
        axis.position === 'top'
          ? acc + (axis.height || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0)
          : acc,
      0,
    );
  },
);

export const selectorChartBottomAxisSize = createSelectorMemoized(
  selectorChartRawXAxis,
  function selectorChartBottomAxisSize(xAxis) {
    return (xAxis ?? []).reduce(
      (acc, axis) =>
        axis.position === 'bottom'
          ? acc + (axis.height || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0)
          : acc,
      0,
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
