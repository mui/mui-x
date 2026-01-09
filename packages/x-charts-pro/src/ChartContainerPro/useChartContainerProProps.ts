'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartContainerProps,
  type UseChartContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import type * as React from 'react';
import { type ChartDataProviderProps } from '@mui/x-charts/ChartDataProvider';
import type { ChartContainerProProps } from './ChartContainerPro';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';

export type UseChartContainerProPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = Pick<
  UseChartContainerPropsReturnValue<TSeries, TSignatures>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderProProps: ChartDataProviderProps<TSeries, TSignatures>;
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
  } as unknown as ChartDataProviderProps<TSeries, TSignatures>;

  return {
    chartDataProviderProProps,
    chartsSurfaceProps,
    children,
  };
};
