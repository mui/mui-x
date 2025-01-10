import { ChartRootSelector, createSelector } from '../../utils/selectors';
import { UseChartZAxisSignature } from './useChartZAxis.types';

const selectZAxis: ChartRootSelector<UseChartZAxisSignature> = (state) => state.zAxis;

export const selectorChartZAxis = createSelector([selectZAxis], (axis) => axis);
