'use client';
import * as React from 'react';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartDataProviderProps } from '../context/ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';
import {
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';

export type UseChartContainerPropsReturnValue = {
  chartDataProviderProps: ChartDataProviderProps<[UseChartCartesianAxisSignature]>;
  chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> };
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
    sx,
    title,
    xAxis,
    yAxis,
    zAxis,
    skipAnimation,
    ...other
  } = props;

  const chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> } = {
    title,
    desc,
    sx,
    disableAxisListener,
    ref,
    ...other,
  };

  const chartDataProviderProps: ChartDataProviderProps<[UseChartCartesianAxisSignature]> = {
    margin,
    series,
    colors,
    dataset,
    highlightedItem,
    onHighlightChange,
    xAxis,
    yAxis,
    zAxis,
    skipAnimation,
    width,
    height,
    plugins: [useChartCartesianAxis],
  };

  return {
    chartDataProviderProps,
    chartsSurfaceProps,
    children,
  };
};
