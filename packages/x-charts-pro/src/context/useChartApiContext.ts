import { useChartApiContext as useChartApiContextCommunity } from '@mui/x-charts/context';
import { ChartProApi } from '../ChartContainerPro';

/**
 * The `useChartApiContext` hook provides access to the chart API.
 * This is only available when the chart is rendered within a chart or a `ChartDataProvider` component.
 * If you want to access the chart API outside those components, you should use the `apiRef` prop instead.
 * @example
 * const apiRef = useChartApiContext<ChartApi<'bar'>>();
 */
export function useChartApiContext<Api extends ChartProApi>() {
  return useChartApiContextCommunity<Api>();
}
