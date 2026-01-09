'use client';
import type * as React from 'react';
import { type ChartsSurfaceProps } from '../ChartsSurface';
import { type ChartDataProviderProps } from '../ChartDataProvider';
import type { ChartContainerProps } from './ChartContainer';
import { type ChartSeriesType } from '../models/seriesType/config';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';
import { type ChartAnyPluginSignature } from '../internals/plugins/models/plugin';

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
    onAxisClick,
    highlightedAxis,
    onHighlightedAxisChange,
    tooltipItem,
    onTooltipItemChange,
    disableVoronoi,
    voronoiMaxRadius,
    onItemClick,
    disableAxisListener,
    highlightedItem,
    onHighlightChange,
    sx,
    title,
    xAxis,
    yAxis,
    zAxis,
    rotationAxis,
    radiusAxis,
    skipAnimation,
    seriesConfig,
    plugins,
    localeText,
    slots,
    slotProps,
    experimentalFeatures,
    enableKeyboardNavigation,
    brushConfig,
    onHiddenItemsChange,
    hiddenItems,
    ...other
  } = props as ChartContainerProps<TSeries, AllPluginSignatures>;

  const chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> } = {
    title,
    desc,
    sx,
    ref,
    ...other,
  };

  const chartDataProviderProps: Omit<ChartDataProviderProps<TSeries, TSignatures>, 'children'> = {
    margin,
    series,
    colors,
    dataset,
    disableAxisListener,
    highlightedItem,
    onHighlightChange,
    onAxisClick,
    highlightedAxis,
    onHighlightedAxisChange,
    tooltipItem,
    onTooltipItemChange,
    disableVoronoi,
    voronoiMaxRadius,
    onItemClick,
    xAxis,
    yAxis,
    zAxis,
    rotationAxis,
    radiusAxis,
    skipAnimation,
    width,
    height,
    localeText,
    seriesConfig,
    experimentalFeatures,
    enableKeyboardNavigation,
    brushConfig,
    onHiddenItemsChange,
    hiddenItems,
    plugins: plugins ?? DEFAULT_PLUGINS,
    slots,
    slotProps,
  } as unknown as Omit<ChartDataProviderProps<TSeries, TSignatures>, 'children'>;

  return {
    chartDataProviderProps,
    chartsSurfaceProps,
    children,
  };
};
