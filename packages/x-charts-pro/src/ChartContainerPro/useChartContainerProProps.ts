'use client';
import {
  ChartDataProviderProps,
  ChartPlugin,
  ChartSeriesType,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartContainerProps,
  UseChartContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import * as React from 'react';
import type { ChartContainerProProps } from './ChartContainerPro';
import { useChartProZoom } from '../internals/plugins/useChartProZoom';
import { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom/useChartProZoom.types';

export type UseChartContainerProPropsReturnValue<TSeries extends ChartSeriesType> = Pick<
  UseChartContainerPropsReturnValue<TSeries>,
  'chartsSurfaceProps' | 'children'
> & {
  chartDataProviderProProps: ChartDataProviderProps<
    [UseChartCartesianAxisSignature<TSeries>, UseChartProZoomSignature],
    TSeries
  >;
};

export const useChartContainerProProps = <TSeries extends ChartSeriesType = ChartSeriesType>(
  props: ChartContainerProProps<TSeries>,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerProPropsReturnValue<TSeries> => {
  const { initialZoom, onZoomChange, plugins, apiRef, ...baseProps } = props;

  const chartDataProviderProProps: Pick<
    ChartDataProviderProps<
      [UseChartCartesianAxisSignature<TSeries>, UseChartProZoomSignature],
      TSeries
    >,
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
      plugins: plugins ?? [
        // eslint-disable-next-line react-compiler/react-compiler
        useChartCartesianAxis as unknown as ChartPlugin<UseChartCartesianAxisSignature<TSeries>>,
        // eslint-disable-next-line react-compiler/react-compiler
        useChartProZoom,
      ],
    },
    chartsSurfaceProps,
    children,
  };
};
