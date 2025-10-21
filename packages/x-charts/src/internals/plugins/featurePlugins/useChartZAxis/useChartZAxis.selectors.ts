import { ChartState } from '../../models/chart';
import { createChartSelector } from '../../utils/selectors';
import { UseChartZAxisSignature } from './useChartZAxis.types';

const selectRootState = (state: ChartState<[UseChartZAxisSignature]>) => state;

export const selectorChartZAxis = createChartSelector([selectRootState], (state) => state.zAxis);
