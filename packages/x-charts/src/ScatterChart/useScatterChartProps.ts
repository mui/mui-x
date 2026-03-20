'use client';
import * as React from 'react';
import { type ChartsAxisProps } from '../ChartsAxis';
import { type ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { type ChartsGridProps } from '../ChartsGrid';
import { type ChartsLegendSlotExtension } from '../ChartsLegend';
import { type ChartsOverlayProps } from '../ChartsOverlay';
import { type ChartsContainerProps } from '../ChartsContainer';
import type { ScatterChartProps } from './ScatterChart';
import type { ScatterPlotProps } from './ScatterPlot';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import { SCATTER_CHART_PLUGINS, type ScatterChartPluginSignatures } from './ScatterChart.plugins';
import { type UseChartClosestPointSignature } from '../internals/plugins/featurePlugins/useChartClosestPoint';

/**
 * A helper function that extracts ScatterChartProps from the input props
 * and returns an object with props for the children components of ScatterChart.
 *
 * @param props The input props for ScatterChart
 * @returns An object with props for the children components of ScatterChart
 */
export const useScatterChartProps = (props: ScatterChartProps) => {
  const {
    xAxis,
    yAxis,
    zAxis,
    series,
    axisHighlight,
    hitAreaRadius,
    disableHitArea,
    hideLegend,
    width,
    height,
    margin,
    colors,
    sx,
    grid,
    onItemClick,
    children,
    slots,
    slotProps,
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    showToolbar,
    renderer,
    brushConfig,
    ...other
  } = props;

  const seriesWithDefault = React.useMemo(
    () => series.map((s) => ({ type: 'scatter' as const, ...s })),
    [series],
  );
  const resolvedDisableHitArea = disableHitArea;
  const useVoronoiOnItemClick = resolvedDisableHitArea !== true || renderer === 'svg-batch';
  const chartsContainerProps: ChartsContainerProps<'scatter', ScatterChartPluginSignatures> = {
    ...other,
    series: seriesWithDefault,
    width,
    height,
    margin,
    colors,
    xAxis,
    yAxis,
    zAxis,
    highlightedItem,
    onHighlightChange,
    disableHitArea,
    hitAreaRadius,
    onItemClick: useVoronoiOnItemClick
      ? (onItemClick as UseChartClosestPointSignature['params']['onItemClick'])
      : undefined,
    plugins: SCATTER_CHART_PLUGINS,
    slots,
    slotProps,
    brushConfig,
  };

  const chartsAxisProps: ChartsAxisProps = {
    slots,
    slotProps,
  };

  const gridProps: ChartsGridProps = {
    vertical: grid?.vertical,
    horizontal: grid?.horizontal,
  };

  const scatterPlotProps: ScatterPlotProps = {
    onItemClick: useVoronoiOnItemClick
      ? undefined
      : (onItemClick as ScatterPlotProps['onItemClick']),
    slots,
    slotProps,
    renderer,
  };

  const overlayProps: ChartsOverlayProps = {
    loading,
    slots,
    slotProps,
  };

  const legendProps: ChartsLegendSlotExtension = {
    slots,
    slotProps,
  };

  const axisHighlightProps: ChartsAxisHighlightProps = {
    y: 'none' as const,
    x: 'none' as const,
    ...axisHighlight,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    legendPosition: props.slotProps?.legend?.position,
    legendDirection: props.slotProps?.legend?.direction,
    hideLegend: props.hideLegend ?? false,
    className,
  };

  return {
    chartsWrapperProps,
    chartsContainerProps,
    chartsAxisProps,
    gridProps,
    scatterPlotProps,
    overlayProps,
    legendProps,
    axisHighlightProps,
    children,
  };
};
