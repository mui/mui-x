'use client';
import * as React from 'react';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartDataProviderProps } from '../ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';
import { ChartSeriesType } from '../models/seriesType/config';
import { ALL_PLUGINS, AllPluginSignatures, AllPluginsType } from '../internals/plugins/allPlugins';

export type UseChartContainerPropsReturnValue<TSeries extends ChartSeriesType> = {
  chartDataProviderProps: ChartDataProviderProps<TSeries, AllPluginSignatures<TSeries>>;
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
    onAxisClick,
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
    ref,
    ...other,
  };

  const chartDataProviderProps: Omit<
    ChartDataProviderProps<TSeries, AllPluginSignatures<TSeries>>,
    'children'
  > = {
    margin,
    series,
    colors,
    dataset,
    highlightedItem,
    onHighlightChange,
    onAxisClick,
    xAxis,
    yAxis,
    zAxis,
    skipAnimation,
    width,
    height,
    seriesConfig,
    plugins: ALL_PLUGINS as unknown as AllPluginsType<TSeries>,
    disableAxisListener,
  };

  return {
    chartDataProviderProps,
    chartsSurfaceProps,
    children,
  };
};
