'use client';
import { ChartDataProviderProps } from '../context/ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';
import { useChartContainerDimensions } from './useChartContainerDimensions';

export type UseChartContainerPropsReturnValue = {
  hasIntrinsicSize: boolean;
  chartDataProviderProps: ChartDataProviderProps;
  resizableChartContainerProps: {
    ownerState: { width: ChartContainerProps['width']; height: ChartContainerProps['height'] };
    ref: React.Ref<HTMLDivElement>;
  };
};

export const useChartContainerProps = (
  props: ChartContainerProps,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerPropsReturnValue => {
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

  const chartDataProviderProps = {
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
    hasIntrinsicSize: Boolean(dWidth && dHeight),
    chartDataProviderProps,
    resizableChartContainerProps,
  };
};
