import type { ChartsVoronoiHandlerProps } from '../ChartsVoronoiHandler';
import type { ScatterChartProps } from './ScatterChart';
import type { ScatterPlotProps } from './ScatterPlot';

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
    tooltip,
    axisHighlight,
    voronoiMaxRadius,
    disableVoronoi,
    legend,
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
  } = props;

  const chartContainerProps = {
    series: series.map((s) => ({ type: 'scatter' as const, ...s })),
    width,
    height,
    margin,
    colors,
    xAxis,
    yAxis,
    sx,
    highlightedItem,
    onHighlightChange,
  };
  const zAxisProps = {
    zAxis,
  };
  const voronoiHandlerProps = {
    voronoiMaxRadius,
    onItemClick: onItemClick as ChartsVoronoiHandlerProps['onItemClick'],
  };
  const chartsAxisProps = {
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    slots,
    slotProps,
  };

  const gridProps = {
    vertical: grid?.vertical,
    horizontal: grid?.horizontal,
  };

  const scatterPlotProps = {
    onItemClick: disableVoronoi ? (onItemClick as ScatterPlotProps['onItemClick']) : undefined,
    slots,
    slotProps,
  };

  const overlayProps = {
    loading,
    slots,
    slotProps,
  };

  const legendProps = {
    ...legend,
    slots,
    slotProps,
  };

  const axisHighlightProps = {
    y: 'none' as const,
    x: 'none' as const,
    ...axisHighlight,
  };

  const tooltipProps = {
    trigger: 'item' as const,
    ...tooltip,
    slots,
    slotProps,
  };

  return {
    chartContainerProps,
    zAxisProps,
    voronoiHandlerProps,
    chartsAxisProps,
    gridProps,
    scatterPlotProps,
    overlayProps,
    legendProps,
    axisHighlightProps,
    tooltipProps,
    children,
  };
};
