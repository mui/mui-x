import { ChartContainerProps } from '../ChartContainer';
import type { ResponsiveChartContainerProps } from './ResponsiveChartContainer';

export const useResponsiveChartContainerProps = (props: ResponsiveChartContainerProps) => {
  const {
    width,
    height,
    margin,
    children,
    series,
    colors,
    dataset,
    desc,
    disableAxisListener,
    highlightedItem,
    onHighlightChange,
    plugins,
    sx,
    title,
    viewBox,
    xAxis,
    yAxis,
    zAxis,
    ...rest
  } = props;

  const resizableChartContainerProps = {
    ...rest,
    ownerState: { width, height },
  };

  const chartContainerProps: Omit<ChartContainerProps, 'height' | 'width'> = {
    margin,
    children,
    series,
    colors,
    dataset,
    desc,
    disableAxisListener,
    highlightedItem,
    onHighlightChange,
    plugins,
    sx,
    title,
    viewBox,
    xAxis,
    yAxis,
    zAxis,
  };

  return {
    inWidth: width,
    inHeight: height,
    chartContainerProps,
    resizableChartContainerProps,
  };
};
