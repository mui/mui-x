'use client';
import * as React from 'react';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartDataProviderProps } from '../context/ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';

export type UseChartContainerPropsReturnValue = {
  chartDataProviderProps: ChartDataProviderProps;
  chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> };
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

  const chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> } = {
    title,
    desc,
    sx,
    disableAxisListener,
    ref,
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
