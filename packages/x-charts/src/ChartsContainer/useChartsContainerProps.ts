'use client';
import type * as React from 'react';
import { type ChartsSurfaceProps } from '../ChartsSurface';
import { type ChartDataProviderProps } from '../ChartDataProvider';
import type { ChartsContainerProps } from './ChartsContainer';
import { type ChartSeriesType } from '../models/seriesType/config';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';
import { type ChartAnyPluginSignature } from '../internals/plugins/models/plugin';

export type UseChartsContainerPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = {
  chartDataProviderProps: ChartDataProviderProps<TSeries, TSignatures>;
  chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> };
  children: React.ReactNode;
};

export const useChartsContainerProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartsContainerProps<TSeries, TSignatures>,
  ref: React.Ref<SVGSVGElement>,
): UseChartsContainerPropsReturnValue<TSeries, TSignatures> => {
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
    axesGap,
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
    initialHiddenItems,
    ...other
  } = props as ChartsContainerProps<TSeries, AllPluginSignatures<TSeries>>;

  const chartsSurfaceProps: ChartsSurfaceProps & { ref: React.Ref<SVGSVGElement> } = {
    title,
    desc,
    sx,
    ref,
    ...other,
  };

  const chartDataProviderProps = {
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
    axesGap,
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
    initialHiddenItems,
    plugins: plugins ?? DEFAULT_PLUGINS,
    slots,
    slotProps,
  } as unknown as ChartDataProviderProps<TSeries, TSignatures>;

  return {
    chartDataProviderProps,
    chartsSurfaceProps,
    children,
  };
};
