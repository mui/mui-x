'use client';
import { useChartContainerProps, UseChartContainerPropsReturnValue } from '@mui/x-charts/internals';
import * as React from 'react';
import type { ChartDataProviderProProps } from '../context/ChartDataProviderPro';
import type { ChartContainerProProps } from './ChartContainerPro';

export type UseChartContainerProPropsReturnValue = Omit<
  UseChartContainerPropsReturnValue,
  'chartDataProviderProps'
> & {
  chartDataProviderProProps: ChartDataProviderProProps;
};

export const useChartContainerProProps = (
  props: ChartContainerProProps,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerProPropsReturnValue => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const chartDataProviderProProps: Pick<ChartDataProviderProProps, 'zoom' | 'onZoomChange'> = {
    zoom,
    onZoomChange,
  };

  const { chartDataProviderProps, chartsSurfaceProps, children } = useChartContainerProps(
    baseProps,
    ref,
  );

  return {
    chartDataProviderProProps: {
      ...chartDataProviderProps,
      ...chartDataProviderProProps,
    },
    chartsSurfaceProps,
    children,
  };
};
