import { createSelector } from '../../utils/selectors';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { ChartState } from '../../models/chart';

export const selectorChartCartesianAxisState = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.cartesianAxis;

export const selectorChartRawXAxis = createSelector(
  selectorChartCartesianAxisState,
  (axis) => axis?.x,
);

export const selectorChartRawYAxis = createSelector(
  selectorChartCartesianAxisState,
  (axis) => axis?.y,
);
