import { useChartApiContext as useChartApiContextCommunity } from '@mui/x-charts/context';
import { ChartProApi } from '../ChartContainerPro';

/**
 * The `useChartApiContext` hook provides access to the chart API.
 * It can be used to interact with the chart when rendering custom components that are descendants of the `ChartDataProvider` component.
 * @example
 * const apiRef = useChartApiContext<ChartProApi<'bar'>>();
 */
export function useChartApiContext<Api extends ChartProApi = ChartProApi>() {
  return useChartApiContextCommunity<Api>();
}
