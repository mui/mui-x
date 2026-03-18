'use client';
import { type ChartsSurfaceProps } from '../ChartsSurface';
import { type ChartsDataProviderProps } from '../ChartsDataProvider';
import type { ChartsContainerProps } from './ChartsContainer';
import { type ChartSeriesType } from '../models/seriesType/config';
import { DEFAULT_PLUGINS, type AllPluginSignatures } from '../internals/plugins/allPlugins';
import { type ChartAnyPluginSignature } from '../internals/plugins/models/plugin';

export type UseChartsContainerPropsReturnValue<
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = {
  chartsDataProviderProps: ChartsDataProviderProps<SeriesType, TSignatures>;
  chartsSurfaceProps: ChartsSurfaceProps;
  children: React.ReactNode;
};

export const useChartsContainerProps = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  props: ChartsContainerProps<SeriesType, TSignatures>,
): UseChartsContainerPropsReturnValue<SeriesType, TSignatures> => {
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
    tooltipAxis,
    onTooltipAxisChange,
    tooltipItem,
    onTooltipItemChange,
    disableHitArea,
    disableVoronoi,
    hitAreaRadius,
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
    experimentalFeatures,
    plugins,
    localeText,
    slots,
    slotProps,
    disableKeyboardNavigation,
    brushConfig,
    onHiddenItemsChange,
    hiddenItems,
    initialHiddenItems,
    ...other
  } = props as ChartsContainerProps<SeriesType, AllPluginSignatures<SeriesType>>;

  const chartsSurfaceProps: ChartsSurfaceProps = {
    title,
    desc,
    sx,
    ...other,
  };

  const chartsDataProviderProps = {
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
    tooltipAxis,
    onTooltipAxisChange,
    tooltipItem,
    onTooltipItemChange,
    disableHitArea,
    disableVoronoi,
    hitAreaRadius,
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
    disableKeyboardNavigation,
    brushConfig,
    onHiddenItemsChange,
    hiddenItems,
    initialHiddenItems,
    plugins: plugins ?? DEFAULT_PLUGINS,
    slots,
    slotProps,
  } as unknown as ChartsDataProviderProps<SeriesType, TSignatures>;

  return {
    chartsDataProviderProps,
    chartsSurfaceProps,
    children,
  };
};
