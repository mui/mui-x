import { ChartState } from '../../models/chart';
import { createSelector } from '../../utils/selectors';
import { UseChartZAxisSignature } from './useChartZAxis.types';

const selectRootState = (state: ChartState<[UseChartZAxisSignature]>) => state;

export const selectorChartZAxis = createSelector([selectRootState], (state) => state.zAxis);
