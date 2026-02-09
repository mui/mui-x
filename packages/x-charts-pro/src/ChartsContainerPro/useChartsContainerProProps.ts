'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartsContainerProps,
  type UseChartsContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import type * as React from 'react';
import type { ChartDataProviderProProps } from '../ChartDataProviderPro';
import type { ChartsContainerProProps } from './ChartsContainerPro';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';

export type UseChartsContainerProPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = Pick<
  UseChartsContainerPropsReturnValue<TSeries, TSignatures>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderProProps: ChartDataProviderProProps<TSeries, TSignatures>;
};

export const useChartsContainerProProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartsContainerProProps<TSeries, TSignatures>,
  ref: React.Ref<SVGSVGElement>,
): UseChartsContainerProPropsReturnValue<TSeries, TSignatures> => {
  const {
    initialZoom,
    zoomData,
    onZoomChange,
    zoomInteractionConfig,
    plugins,
    apiRef,
    ...baseProps
  } = props as ChartsContainerProProps<TSeries, AllPluginSignatures<TSeries>>;

  const { chartDataProviderProps, chartsSurfaceProps, children } = useChartsContainerProps<TSeries>(
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
