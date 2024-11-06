'use client';
import { ChartDataProviderProps } from '../ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';
import { useChartContainerDimensions } from './useChartContainerDimensions';

export const useChartContainerProps = (
  props: ChartContainerProps,
  ref: React.ForwardedRef<unknown>,
) => {
  const {
    width,
    height,
    resolveSizeBeforeRender,
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
    skipAnimation,
    ...other
  } = props;

  const {
    containerRef,
    width: dWidth,
    height: dHeight,
  } = useChartContainerDimensions(width, height, resolveSizeBeforeRender);

  const resizableChartContainerProps = {
    ...other,
    ownerState: { width, height },
    ref: containerRef,
  };

  const chartDataProviderProps: ChartDataProviderProps & { ref: React.ForwardedRef<unknown> } = {
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
    skipAnimation,
    width: dWidth,
    height: dHeight,
    ref,
  };

  return {
    hasIntrinsicSize: dWidth && dHeight,
    chartDataProviderProps,
    resizableChartContainerProps,
  };
};
