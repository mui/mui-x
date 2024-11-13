'use client';
import { ChartDataProviderProps } from '../context/ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';

export type UseChartContainerPropsReturnValue = {
  chartDataProviderProps: ChartDataProviderProps;
  resizableContainerProps: any;
  children: React.ReactNode;
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
    xAxis,
    yAxis,
    zAxis,
    skipAnimation,
    ...other
  } = props;

  const resizableContainerProps = other;

  const chartDataProviderProps = {
    margin,
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
    xAxis,
    yAxis,
    zAxis,
    skipAnimation,
    width,
    height,
    ref,
  };

  return {
    chartDataProviderProps,
    resizableContainerProps,
    children,
  };
};
