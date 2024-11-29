import { ChartRootSelector, createSelector } from '../../utils/selectors';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';

export const selectorChartCartesianAxisState: ChartRootSelector<UseChartCartesianAxisSignature> = (
  state,
) => state.cartesianAxis;

export const selectorChartXAxis = createSelector(selectorChartCartesianAxisState, (axis) => axis.x);

export const selectorChartYAxis = createSelector(selectorChartCartesianAxisState, (axis) => axis.y);
