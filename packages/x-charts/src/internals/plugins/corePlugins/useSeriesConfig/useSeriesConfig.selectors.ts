import { createSelector } from '@mui/x-internals/store';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseSeriesConfigSignature } from './useSeriesConfig.types';

export const selectorChartSeriesConfigState: ChartRootSelector<UseSeriesConfigSignature> = (
  state,
) => state.seriesConfig;

export const selectorChartSeriesConfig = createSelector(
  selectorChartSeriesConfigState,
  (seriesConfigState) => seriesConfigState.config,
);
