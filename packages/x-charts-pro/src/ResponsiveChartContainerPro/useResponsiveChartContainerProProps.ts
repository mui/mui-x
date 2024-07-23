import { useResponsiveChartContainerProps } from '@mui/x-charts/internals';
import type { ChartContainerProProps } from '../ChartContainerPro';
import type { ResponsiveChartContainerProProps } from './ResponsiveChartContainerPro';

export const useResponsiveChartContainerProProps = (
  props: ResponsiveChartContainerProProps,
  ref: React.ForwardedRef<unknown>,
) => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const chartContainerProProps: Pick<ChartContainerProProps, 'zoom' | 'onZoomChange'> = {
    zoom,
    onZoomChange,
  };

  const { chartContainerProps, resizableChartContainerProps, hasIntrinsicSize } =
    useResponsiveChartContainerProps(baseProps, ref);

  return {
    chartContainerProProps: {
      ...chartContainerProps,
      ...chartContainerProProps,
    },
    resizableChartContainerProps,
    hasIntrinsicSize,
  };
};
