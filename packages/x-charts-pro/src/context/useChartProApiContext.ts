import { useChartApiContext as useChartApiContextCommunity } from '@mui/x-charts/context';
import { type ChartProApi } from './ChartProApi';

/**
 * The `useChartProApiContext` hook provides access to the chart API.
 * This is only available when the chart is rendered within a chart or a `ChartDataProviderPro` component.
 * If you want to access the chart API outside those components, you should use the `apiRef` prop instead.
 * @example
 * const apiRef = useChartProApiContext<ChartProApi<'bar'>>();
 */
export function useChartProApiContext<Api extends ChartProApi>() {
  return useChartApiContextCommunity<Api>();
}
