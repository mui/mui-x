import useId from '@mui/utils/useId';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import type { LineChartProps } from './LineChart';
import { ResponsiveChartContainerProps } from '../ResponsiveChartContainer';
import { ChartsOnAxisClickHandlerProps } from '../ChartsOnAxisClickHandler';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsClipPathProps } from '../ChartsClipPath';
import { AreaPlotProps } from './AreaPlot';
import { LinePlotProps } from './LinePlot';
import { MarkPlotProps } from './MarkPlot';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { LineHighlightPlotProps } from './LineHighlightPlot';
import { ChartsLegendProps } from '../ChartsLegend';
import { ChartsTooltipProps } from '../ChartsTooltip';

/**
 * A helper function that extracts LineChartProps from the input props
 * and returns an object with props for the children components of LineChart.
 *
 * @param props The input props for LineChart
 * @returns An object with props for the children components of LineChart
 */
export const useLineChartProps = (props: LineChartProps) => {
  const {
    xAxis,
    yAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    tooltip,
    onAxisClick,
    onAreaClick,
    onLineClick,
    onMarkClick,
    axisHighlight,
    disableLineItemHighlight,
    legend,
    grid,
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    ...other
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const chartContainerProps: ResponsiveChartContainerProps = {
    ...other,
    series: series.map((s) => ({
      disableHighlight: !!disableLineItemHighlight,
      type: 'line' as const,
      ...s,
    })),
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: xAxis ?? [
      {
        id: DEFAULT_X_AXIS_KEY,
        scaleType: 'point',
        data: Array.from(
          { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
          (_, index) => index,
        ),
      },
    ],
    yAxis,
    sx,
    highlightedItem,
    onHighlightChange,
    disableAxisListener:
      tooltip?.trigger !== 'axis' &&
      axisHighlight?.x === 'none' &&
      axisHighlight?.y === 'none' &&
      !onAxisClick,
    className,
  };

  const axisClickHandlerProps: ChartsOnAxisClickHandlerProps = {
    onAxisClick,
  };

  const gridProps: ChartsGridProps = {
    vertical: grid?.vertical,
    horizontal: grid?.horizontal,
  };

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps: ChartsClipPathProps = {
    id: clipPathId,
  };

  const areaPlotProps: AreaPlotProps = {
    slots,
    slotProps,
    onItemClick: onAreaClick,
    skipAnimation,
  };

  const linePlotProps: LinePlotProps = {
    slots,
    slotProps,
    onItemClick: onLineClick,
    skipAnimation,
  };

  const markPlotProps: MarkPlotProps = {
    slots,
    slotProps,
    onItemClick: onMarkClick,
    skipAnimation,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const chartsAxisProps: ChartsAxisProps = {
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    slots,
    slotProps,
  };

  const axisHighlightProps: ChartsAxisHighlightProps = {
    x: 'line' as const,
    ...axisHighlight,
  };

  const lineHighlightPlotProps: LineHighlightPlotProps = {
    slots,
    slotProps,
  };

  const legendProps: ChartsLegendProps = {
    ...legend,
    slots,
    slotProps,
  };

  const tooltipProps: ChartsTooltipProps<'line'> = {
    ...tooltip,
    slots,
    slotProps,
  };

  return {
    chartContainerProps,
    axisClickHandlerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    areaPlotProps,
    linePlotProps,
    markPlotProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    lineHighlightPlotProps,
    legendProps,
    tooltipProps,
    children,
  };
};
