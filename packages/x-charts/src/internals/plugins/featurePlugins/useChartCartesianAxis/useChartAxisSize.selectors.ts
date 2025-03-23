import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import { createSelector } from '../../utils/selectors';

export const selectorChartLeftAxisSize = createSelector([selectorChartRawYAxis], (yAxis) =>
  (yAxis ?? []).reduce(
    (acc, axis) => (axis.position === 'left' ? acc + (axis.width || 0) : acc),
    0,
  ),
);

export const selectorChartRightAxisSize = createSelector([selectorChartRawYAxis], (yAxis) =>
  (yAxis ?? []).reduce(
    (acc, axis) => (axis.position === 'right' ? acc + (axis.width || 0) : acc),
    0,
  ),
);

export const selectorChartTopAxisSize = createSelector([selectorChartRawXAxis], (xAxis) =>
  (xAxis ?? []).reduce(
    (acc, axis) => (axis.position === 'top' ? acc + (axis.height || 0) : acc),
    0,
  ),
);

export const selectorChartBottomAxisSize = createSelector([selectorChartRawXAxis], (xAxis) =>
  (xAxis ?? []).reduce(
    (acc, axis) => (axis.position === 'bottom' ? acc + (axis.height || 0) : acc),
    0,
  ),
);
