import { useChartApiContext as useChartApiContextCommunity } from '@mui/x-charts/context';
import { type ChartPremiumApi } from './ChartPremiumApi';

/**
 * The `useChartPremiumApiContext` hook provides access to the chart API.
 * This is only available when the chart is rendered within a chart or a `ChartsDataProviderPremium` component.
 * If you want to access the chart API outside those components, you should use the `apiRef` prop instead.
 * @example
 * const apiRef = useChartPremiumApiContext<ChartPremiumApi<'bar'>>();
 */
export function useChartPremiumApiContext<Api extends ChartPremiumApi>() {
  return useChartApiContextCommunity<Api>();
}
