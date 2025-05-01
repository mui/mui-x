import { useChartApiContext as useChartApiContextCommunity } from '@mui/x-charts/context';
import { AllPluginSignatures } from '../internals/plugins/allPlugins';

type IntersectionFromUnion<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type ChartApiPro = IntersectionFromUnion<AllPluginSignatures[number]['publicAPI']>;

/**
 * The `useChartApiContext` hook provides access to the chart API.
 * It can be used to interact with the chart when rendering custom components that are descendants of the `ChartDataProvider` component.
 */
export function useChartApiContext<Api extends {} = ChartApiPro>() {
  return useChartApiContextCommunity<Api>();
}
