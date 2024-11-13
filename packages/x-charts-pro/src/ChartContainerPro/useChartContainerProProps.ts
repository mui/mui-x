'use client';
import { useChartContainerProps, UseChartContainerPropsReturnValue } from '@mui/x-charts/internals';
import type { ChartDataProviderProProps } from '../context/ChartDataProviderPro';
import type { ChartContainerProProps } from './ChartContainerPro';

export type UseChartContainerProPropsReturnValue = Omit<
  UseChartContainerPropsReturnValue,
  'chartDataProviderProps'
> & {
  chartDataProviderProProps: ChartDataProviderProProps;
};

export const useChartContainerProProps = (props: ChartContainerProProps) => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const chartDataProviderProProps: Pick<ChartDataProviderProProps, 'zoom' | 'onZoomChange'> = {
    zoom,
    onZoomChange,
  };

  const { chartDataProviderProps, chartsSurfaceProps, resizableContainerProps, children } =
    useChartContainerProps(baseProps);

  return {
    chartDataProviderProProps: {
      ...chartDataProviderProps,
      ...chartDataProviderProProps,
    },
    resizableContainerProps,
    chartsSurfaceProps,
    children,
  };
};
