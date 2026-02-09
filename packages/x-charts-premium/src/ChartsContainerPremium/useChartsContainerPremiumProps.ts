'use client';
import type * as React from 'react';
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
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = Pick<
  UseChartsContainerPropsReturnValue<TSeries, TSignatures>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderPremiumProps: ChartDataProviderPremiumProps<TSeries, TSignatures>;
};

export function useChartsContainerPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartsContainerPremiumProps<TSeries, TSignatures>,
  ref: React.Ref<SVGSVGElement>,
): UseChartsContainerPremiumPropsReturnValue<TSeries, TSignatures> {
  const {
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    plugins,
    apiRef,
    ...baseProps
  } = props as ChartsContainerPremiumProps<TSeries, AllPluginSignatures<TSeries>>;

  const { chartDataProviderProProps, chartsSurfaceProps, children } =
    useChartsContainerProProps<TSeries>(baseProps, ref);

  const chartDataProviderPremiumProps = {
    ...chartDataProviderProProps,
    plugins: plugins ?? DEFAULT_PLUGINS,
  } as unknown as ChartDataProviderPremiumProps<TSeries, TSignatures>;

  return {
    chartDataProviderPremiumProps,
    chartsSurfaceProps,
    children,
  };
}
