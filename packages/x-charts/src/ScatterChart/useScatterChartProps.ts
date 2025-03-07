'use client';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendSlotExtension } from '../ChartsLegend';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartContainerProps } from '../ChartContainer';
import type { ScatterChartProps } from './ScatterChart';
import type { ScatterPlotProps } from './ScatterPlot';
import type { ChartsWrapperProps } from '../internals/components/ChartsWrapper';
import { SCATTER_CHART_PLUGINS, ScatterChartPluginsSignatures } from './ScatterChart.plugins';
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
    ...other
  } = props;

  const chartContainerProps: ChartContainerProps<'scatter', ScatterChartPluginsSignatures> = {
    ...other,
    series: series.map((s) => ({ type: 'scatter' as const, ...s })),
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
    onItemClick: disableVoronoi
      ? undefined
      : (onItemClick as UseChartVoronoiSignature['params']['onItemClick']),
    className,
    plugins: SCATTER_CHART_PLUGINS,
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
    onItemClick: disableVoronoi ? (onItemClick as ScatterPlotProps['onItemClick']) : undefined,
    slots,
    slotProps,
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
