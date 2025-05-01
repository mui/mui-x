import { useChartContext } from './ChartProvider';
import { ChartCorePluginSignatures } from '../internals/plugins/corePlugins';

export type ChartApiCommunity = ChartCorePluginSignatures[number]['publicAPI'];

export function useChartApiContext<Api extends {} = ChartApiCommunity>(): Api {
  const { publicAPI } = useChartContext<ChartCorePluginSignatures>();

  return publicAPI as Api;
}
