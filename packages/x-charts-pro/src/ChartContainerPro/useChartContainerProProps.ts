'use client';
import {
  useChartCartesianAxis,
  useChartContainerProps,
  UseChartContainerPropsReturnValue,
} from '@mui/x-charts/internals';
import * as React from 'react';
import type { ChartDataProviderProProps } from '../context/ChartDataProviderPro';
import type { ChartContainerProProps } from './ChartContainerPro';
import { useChartProZoom } from '../internals/plugins/useChartProZoom';

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
  const { zoom, onZoomChange, plugins, ...baseProps } = props;

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
      // eslint-disable-next-line react-compiler/react-compiler
      plugins: [useChartCartesianAxis, useChartProZoom],
    },
    chartsSurfaceProps,
    children,
  };
};
