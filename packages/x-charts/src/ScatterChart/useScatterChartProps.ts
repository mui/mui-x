'use client';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendSlotExtension } from '../ChartsLegend';
import { ChartsOverlayProps } from '../ChartsOverlay';
import type { ChartsVoronoiHandlerProps } from '../ChartsVoronoiHandler';
import { ChartContainerProps } from '../ChartContainer';
import { ZAxisContextProviderProps } from '../context';
import type { ScatterChartProps } from './ScatterChart';
import type { ScatterPlotProps } from './ScatterPlot';
import type { ChartsWrapperProps } from '../internals/components/ChartsWrapper';
import { calculateMargins } from '../internals/calculateMargins';

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
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
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

  const chartContainerProps: Omit<ChartContainerProps<'scatter'>, 'plugins'> = {
    ...other,
    series: series.map((s) => ({ type: 'scatter' as const, ...s })),
    width,
    height,
    margin: calculateMargins({ margin, hideLegend, slotProps, series }),
    colors,
    xAxis,
    yAxis,
    highlightedItem,
    onHighlightChange,
    className,
  };
  const zAxisProps: Omit<ZAxisContextProviderProps, 'children'> = {
    zAxis,
  };
  const voronoiHandlerProps: ChartsVoronoiHandlerProps = {
    voronoiMaxRadius,
    onItemClick: onItemClick as ChartsVoronoiHandlerProps['onItemClick'],
  };
  const chartsAxisProps: ChartsAxisProps = {
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
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
    zAxisProps,
    voronoiHandlerProps,
    chartsAxisProps,
    gridProps,
    scatterPlotProps,
    overlayProps,
    legendProps,
    axisHighlightProps,
    children,
  };
};
