'use client';
import * as React from 'react';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartDataProviderProps } from '../ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';
import { ChartSeriesType } from '../models/seriesType/config';
import { ALL_PLUGINS, AllPluginSignatures } from '../internals/plugins/allPlugins';
import { ChartAnyPluginSignature } from '../internals/plugins/models/plugin';

export type UseChartContainerPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = {
  chartDataProviderProps: Omit<ChartDataProviderProps<TSeries, TSignatures>, 'children'>;
  chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> };
  children: React.ReactNode;
};

export const useChartContainerProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartContainerProps<TSeries, TSignatures>,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerPropsReturnValue<TSeries, TSignatures> => {
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
    // @ts-ignore
    xAxis,
    // @ts-ignore
    yAxis,
    // @ts-ignore
    zAxis,
    // @ts-ignore
    rotationAxis,
    // @ts-ignore
    radiusAxis,
    skipAnimation,
    seriesConfig,
    plugins,
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

  const chartDataProviderProps = {
    margin,
    series,
    colors,
    dataset,
    highlightedItem,
    onHighlightChange,
    rotationAxis,
    radiusAxis,
    skipAnimation,
    width,
    height,
    seriesConfig,
    plugins: plugins ?? ALL_PLUGINS,
  } as unknown as Omit<ChartDataProviderProps<TSeries, TSignatures>, 'children'>;

  return {
    chartDataProviderProps,
    chartsSurfaceProps,
    children,
  };
};
