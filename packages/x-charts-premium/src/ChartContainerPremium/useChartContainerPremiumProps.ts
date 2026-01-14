'use client';
import type * as React from 'react';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  type UseChartContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import { type ChartDataProviderProps } from '@mui/x-charts/ChartDataProvider';
import { useChartContainerProProps } from '@mui/x-charts-pro/internals';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';
import type { ChartContainerPremiumProps } from './ChartContainerPremium';

export type UseChartContainerPremiumPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = Pick<
  UseChartContainerPropsReturnValue<TSeries, TSignatures>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderPremiumProps: ChartDataProviderProps<TSeries, TSignatures>;
};

export function useChartContainerPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartContainerPremiumProps<TSeries, TSignatures>,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerPremiumPropsReturnValue<TSeries, TSignatures> {
  const {
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    plugins,
    apiRef,
    ...baseProps
  } = props as ChartContainerPremiumProps<TSeries, AllPluginSignatures<TSeries>>;

  const { chartDataProviderProProps, chartsSurfaceProps, children } =
    useChartContainerProProps<TSeries>(baseProps, ref);

  const chartDataProviderPremiumProps = {
    ...chartDataProviderProProps,
    plugins: plugins ?? DEFAULT_PLUGINS,
  } as unknown as ChartDataProviderProps<TSeries, TSignatures>;

  return {
    chartDataProviderPremiumProps,
    chartsSurfaceProps,
    children,
  };
}
