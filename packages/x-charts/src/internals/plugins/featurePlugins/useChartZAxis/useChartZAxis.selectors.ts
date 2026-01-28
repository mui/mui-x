import { createSelector } from '@mui/x-internals/store';
import { type ChartState } from '../../models/chart';
import { type UseChartZAxisSignature } from './useChartZAxis.types';

const selectRootState = (state: ChartState<[UseChartZAxisSignature]>) => state;

export const selectorChartZAxis = createSelector(selectRootState, (state) => state.zAxis);
