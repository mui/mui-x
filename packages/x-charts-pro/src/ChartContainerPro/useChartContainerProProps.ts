'use client';
import { useChartContainerProps } from '@mui/x-charts/internals';
import type { ChartDataProviderProProps } from '../context/ChartDataProviderPro';
import type { ChartContainerProProps } from './ChartContainerPro';

export const useChartContainerProProps = (
  props: ChartContainerProProps,
  ref: React.ForwardedRef<unknown>,
) => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const chartDataProviderProProps: Pick<ChartDataProviderProProps, 'zoom' | 'onZoomChange'> = {
    zoom,
    onZoomChange,
  };

  const {
    chartDataProviderProps,
    resizableChartContainerProps,
    hasIntrinsicSize,
    sizedChartDataProviderProps,
  } = useChartContainerProps(baseProps, ref);

  return {
    chartDataProviderProProps: {
      ...chartDataProviderProps,
      ...chartDataProviderProProps,
    },
    sizedChartDataProviderProProps: {
      ...sizedChartDataProviderProps,
      ...chartDataProviderProProps,
    },
    resizableChartContainerProps,
    hasIntrinsicSize,
  };
};
