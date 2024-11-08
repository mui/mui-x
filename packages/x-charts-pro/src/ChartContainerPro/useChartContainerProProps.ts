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

export const useChartContainerProProps = (
  props: ChartContainerProProps,
  ref: React.Ref<SVGSVGElement>,
) => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const chartDataProviderProProps: Pick<ChartDataProviderProProps, 'zoom' | 'onZoomChange'> = {
    zoom,
    onZoomChange,
  };

  const { chartDataProviderProps, resizableChartContainerProps, hasIntrinsicSize } =
    useChartContainerProps(baseProps, ref);

  return {
    chartDataProviderProProps: {
      ...chartDataProviderProps,
      ...chartDataProviderProProps,
    },
    resizableChartContainerProps,
    hasIntrinsicSize,
  };
};
