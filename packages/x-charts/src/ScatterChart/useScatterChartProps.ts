'use client';
import * as React from 'react';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendSlotExtension } from '../ChartsLegend';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartContainerProps } from '../ChartContainer';
import type { ScatterChartProps } from './ScatterChart';
import type { ScatterPlotProps } from './ScatterPlot';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import { SCATTER_CHART_PLUGINS, ScatterChartPluginSignatures } from './ScatterChart.plugins';
import { UseChartVoronoiSignature } from '../internals/plugins/featurePlugins/useChartVoronoi';

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
    voronoiMaxRadius,
    disableVoronoi,
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
    ...other
  } = props;

  const seriesWithDefault = React.useMemo(
    () => series.map((s) => ({ type: 'scatter' as const, ...s })),
    [series],
  );
  const useVoronoiOnItemClick = disableVoronoi !== true || renderer === 'svg-batch';
  const chartContainerProps: ChartContainerProps<'scatter', ScatterChartPluginSignatures> = {
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
    disableVoronoi,
    voronoiMaxRadius,
    onItemClick: useVoronoiOnItemClick
      ? (onItemClick as UseChartVoronoiSignature['params']['onItemClick'])
      : undefined,
    className,
    plugins: SCATTER_CHART_PLUGINS,
    slots,
    slotProps,
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
  };

  return {
    chartsWrapperProps,
    chartContainerProps,
    chartsAxisProps,
    gridProps,
    scatterPlotProps,
    overlayProps,
    legendProps,
    axisHighlightProps,
    children,
  };
};
