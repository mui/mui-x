'use client';
import {
  ChartSeriesType,
  useChartContainerProps,
  UseChartContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import * as React from 'react';
import { ChartDataProviderProps } from '@mui/x-charts/ChartDataProvider';
import type { ChartContainerProProps } from './ChartContainerPro';
import { ALL_PLUGINS, AllPluginsType, AllPluginSignatures } from '../internals/plugins/allPlugins';

export type UseChartContainerProPropsReturnValue<TSeries extends ChartSeriesType> = Pick<
  UseChartContainerPropsReturnValue<TSeries>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderProProps: ChartDataProviderProps<TSeries, AllPluginSignatures<TSeries>>;
};

export const useChartContainerProProps = <TSeries extends ChartSeriesType = ChartSeriesType>(
  props: ChartContainerProProps<TSeries>,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerProPropsReturnValue<TSeries> => {
  const { initialZoom, onZoomChange, plugins, apiRef, ...baseProps } = props;

  const chartDataProviderProProps: Pick<
    ChartDataProviderProps<TSeries, AllPluginSignatures<TSeries>>,
    'initialZoom' | 'onZoomChange'
  > = {
    initialZoom,
    onZoomChange,
  };

  const { chartDataProviderProps, chartsSurfaceProps, children } = useChartContainerProps<TSeries>(
    baseProps,
    ref,
  );

  return {
    chartDataProviderProProps: {
      ...chartDataProviderProps,
      ...chartDataProviderProProps,
      apiRef,
      plugins: plugins ?? (ALL_PLUGINS as unknown as AllPluginsType<TSeries>),
    },
    chartsSurfaceProps,
    children,
  };
};
