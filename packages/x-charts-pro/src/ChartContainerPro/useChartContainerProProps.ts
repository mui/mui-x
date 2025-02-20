'use client';
import {
  ChartAnyPluginSignature,
  ChartSeriesType,
  useChartContainerProps,
  UseChartContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import * as React from 'react';
import { ChartDataProviderProps } from '@mui/x-charts/ChartDataProvider';
import type { ChartContainerProProps } from './ChartContainerPro';
import { ALL_PLUGINS, AllPluginSignatures } from '../internals/plugins/allPlugins';

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
  const { initialZoom, zoomData, onZoomChange, plugins, apiRef, ...baseProps } =
    props as ChartContainerProProps<TSeries, AllPluginSignatures>;

  const { chartDataProviderProps, chartsSurfaceProps, children } = useChartContainerProps(
    baseProps,
    ref,
  );

  const chartDataProviderProProps = {
    ...chartDataProviderProps,
    initialZoom,
    zoomData,
    onZoomChange,
    apiRef,
    plugins: plugins ?? ALL_PLUGINS,
  } as unknown as ChartDataProviderProps<TSeries, TSignatures>;

  return {
    chartDataProviderProProps,
    chartsSurfaceProps,
    children,
  };
};
