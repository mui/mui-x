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
import { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type UseChartContainerProPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
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
  // @ts-ignore
  const { initialZoom, onZoomChange, plugins, apiRef, ...baseProps } = props;

  const chartDataProviderProProps: Pick<
    ChartDataProviderProps<TSeries, [UseChartProZoomSignature]>,
    'initialZoom' | 'onZoomChange'
  > = {
    initialZoom,
    onZoomChange,
  };

  const { chartDataProviderProps, chartsSurfaceProps, children } = useChartContainerProps(
    // @ts-ignore
    baseProps,
    ref,
  );
  console.log({ plugins });
  return {
    // @ts-ignore
    chartDataProviderProProps: {
      ...chartDataProviderProps,
      ...chartDataProviderProProps,
      apiRef,
      plugins: plugins ?? ALL_PLUGINS,
    },
    chartsSurfaceProps,
    children,
  };
};
