'use client';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartDataProviderProps } from '../context/ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';

export type UseChartContainerPropsReturnValue = {
  chartDataProviderProps: ChartDataProviderProps;
  chartsSurfaceProps: ChartsSurfaceProps;
  resizableContainerProps: any;
  children: React.ReactNode;
};

export const useChartContainerProps = (
  props: ChartContainerProps,
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

  const chartsSurfaceProps: ChartsSurfaceProps = {
    title,
    desc,
    sx,
    disableAxisListener,
  };

  const chartDataProviderProps: ChartDataProviderProps = {
    margin,
    series,
    colors,
    dataset,
    highlightedItem,
    onHighlightChange,
    plugins,
    xAxis,
    yAxis,
    zAxis,
    skipAnimation,
    width,
    height,
  };

  return {
    chartDataProviderProps,
    resizableContainerProps,
    chartsSurfaceProps,
    children,
  };
};
