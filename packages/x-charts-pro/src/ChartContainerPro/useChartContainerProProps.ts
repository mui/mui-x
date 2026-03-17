'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartContainerProps,
  type UseChartContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import type * as React from 'react';
import type { ChartDataProviderProProps } from '../ChartDataProviderPro';
import type { ChartContainerProProps } from './ChartContainerPro';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';

export type UseChartContainerProPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = Pick<
  UseChartContainerPropsReturnValue<TSeries, TSignatures>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderProProps: ChartDataProviderProProps<TSeries, TSignatures>;
};

export const useChartContainerProProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartContainerProProps<TSeries, TSignatures>,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerProPropsReturnValue<TSeries, TSignatures> => {
  const {
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    plugins,
    apiRef,
    ...baseProps
  } = props as ChartContainerProProps<TSeries, AllPluginSignatures<TSeries>>;

  const { chartDataProviderProps, chartsSurfaceProps, children } = useChartContainerProps<TSeries>(
    baseProps,
    ref,
  );

  const chartDataProviderProProps = {
    ...chartDataProviderProps,
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    apiRef,
    plugins: plugins ?? DEFAULT_PLUGINS,
  } as unknown as ChartDataProviderProProps<TSeries, TSignatures>;

  return {
    chartDataProviderProProps,
    chartsSurfaceProps,
    children,
  };
};
