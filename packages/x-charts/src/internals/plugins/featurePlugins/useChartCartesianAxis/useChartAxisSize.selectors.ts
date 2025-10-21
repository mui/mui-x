import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import { createChartSelector } from '../../utils/selectors';

export const selectorChartLeftAxisSize = createChartSelector([selectorChartRawYAxis], (yAxis) =>
  (yAxis ?? []).reduce(
    (acc, axis) =>
      axis.position === 'left'
        ? acc + (axis.width || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0)
        : acc,
    0,
  ),
);

export const selectorChartRightAxisSize = createChartSelector([selectorChartRawYAxis], (yAxis) =>
  (yAxis ?? []).reduce(
    (acc, axis) =>
      axis.position === 'right'
        ? acc + (axis.width || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0)
        : acc,
    0,
  ),
);

export const selectorChartTopAxisSize = createChartSelector([selectorChartRawXAxis], (xAxis) =>
  (xAxis ?? []).reduce(
    (acc, axis) =>
      axis.position === 'top'
        ? acc + (axis.height || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0)
        : acc,
    0,
  ),
);

export const selectorChartBottomAxisSize = createChartSelector([selectorChartRawXAxis], (xAxis) =>
  (xAxis ?? []).reduce(
    (acc, axis) =>
      axis.position === 'bottom'
        ? acc + (axis.height || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0)
        : acc,
    0,
  ),
);
