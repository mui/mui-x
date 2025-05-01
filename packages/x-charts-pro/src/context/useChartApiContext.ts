import { useChartApiContext as useChartApiContextCommunity } from '@mui/x-charts/context';
import { AllPluginSignatures } from '../internals/plugins/allPlugins';

type IntersectionFromUnion<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type ChartApiPro = IntersectionFromUnion<AllPluginSignatures[number]['publicAPI']>;

export function useChartApiContext<Api extends {} = ChartApiPro>() {
  return useChartApiContextCommunity<Api>();
}
