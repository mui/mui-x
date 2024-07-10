import { ChartContainerProps } from '../ChartContainer';
import type { ResponsiveChartContainerProps } from './ResponsiveChartContainer';
import { useChartContainerDimensions } from './useChartContainerDimensions';

export const useResponsiveChartContainerProps = (
  props: ResponsiveChartContainerProps,
  ref: React.ForwardedRef<unknown>,
) => {
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

  const {
    containerRef,
    width: dWidth,
    height: dHeight,
  } = useChartContainerDimensions(width, height);

  const resizableChartContainerProps = {
    ...rest,
    ownerState: { width, height },
    ref: containerRef,
  };

  const chartContainerProps: ChartContainerProps & { ref: React.ForwardedRef<unknown> } = {
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
    width: dWidth,
    height: dHeight,
    ref,
  };

  return {
    hasIntrinsicSize: dWidth && dHeight,
    chartContainerProps,
    resizableChartContainerProps,
  };
};
