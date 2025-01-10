'use client';
import * as React from 'react';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartDataProviderProps } from '../context/ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';
import {
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import { ChartSeriesType } from '../models/seriesType/config';

export type UseChartContainerPropsReturnValue<TSeries extends ChartSeriesType> = {
  chartDataProviderProps: ChartDataProviderProps<
    [UseChartCartesianAxisSignature<TSeries>, UseChartInteractionSignature],
    TSeries
  >;
  chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> };
  children: React.ReactNode;
};

export const useChartContainerProps = <TSeries extends ChartSeriesType = ChartSeriesType>(
  props: ChartContainerProps<TSeries>,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerPropsReturnValue<TSeries> => {
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
    seriesConfig,
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

  const chartDataProviderProps: Omit<
    ChartDataProviderProps<
      [UseChartCartesianAxisSignature<TSeries>, UseChartInteractionSignature],
      TSeries
    >,
    'children'
  > = {
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
    seriesConfig,
    plugins: [useChartCartesianAxis as any, useChartInteraction],
  };

  return {
    chartDataProviderProps,
    chartsSurfaceProps,
    children,
  };
};
