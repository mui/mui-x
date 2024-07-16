import type { ResponsiveChartContainerProProps } from './ResponsiveChartContainerPro';

export const useResponsiveChartContainerProProps = (props: ResponsiveChartContainerProProps) => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const chartContainerProProps = {
    zoom,
    onZoomChange,
  };

  return {
    chartContainerProProps,
    baseProps,
  };
};
