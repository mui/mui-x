import { createSelector } from '@mui/x-internals/store';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseSeriesConfigSignature } from './useChartSeriesConfig.types';

export const selectorChartSeriesConfigState: ChartRootSelector<UseSeriesConfigSignature> = (
  state,
) => state.seriesConfig;

export const selectorChartSeriesConfig = createSelector(
  selectorChartSeriesConfigState,
  (seriesConfigState) => seriesConfigState.config,
);
