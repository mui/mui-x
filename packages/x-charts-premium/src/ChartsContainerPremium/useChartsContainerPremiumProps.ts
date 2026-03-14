'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  type UseChartsContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import { useChartsContainerProProps } from '@mui/x-charts-pro/internals';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';
import type { ChartsContainerPremiumProps } from './ChartsContainerPremium';
import type { ChartDataProviderPremiumProps } from '../ChartDataProviderPremium';

export type UseChartsContainerPremiumPropsReturnValue<
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = Pick<
  UseChartsContainerPropsReturnValue<SeriesType, TSignatures>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderPremiumProps: ChartDataProviderPremiumProps<SeriesType, TSignatures>;
};

export function useChartsContainerPremiumProps<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  props: ChartsContainerPremiumProps<SeriesType, TSignatures>,
): UseChartsContainerPremiumPropsReturnValue<SeriesType, TSignatures> {
  const {
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    plugins,
    apiRef,
    ...baseProps
  } = props as ChartsContainerPremiumProps<SeriesType, AllPluginSignatures<SeriesType>>;

  const { chartDataProviderProProps, chartsSurfaceProps, children } =
    useChartsContainerProProps<SeriesType>(baseProps);

  const chartDataProviderPremiumProps = {
    ...chartDataProviderProProps,
    plugins: plugins ?? DEFAULT_PLUGINS,
  } as unknown as ChartDataProviderPremiumProps<SeriesType, TSignatures>;

  return {
    chartDataProviderPremiumProps,
    chartsSurfaceProps,
    children,
  };
}
