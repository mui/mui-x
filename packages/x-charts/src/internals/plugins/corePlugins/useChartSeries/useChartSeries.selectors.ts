import { ChartRootSelector } from '../../utils/selectors';
import { UseChartSeriesSignature } from './useChartSeries.types';

export const selectorChartSeriesState: ChartRootSelector<UseChartSeriesSignature> = (state) =>
  state.series;
