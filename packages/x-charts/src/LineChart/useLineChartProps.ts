import useId from '@mui/utils/useId';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import type { LineChartProps } from './LineChart';

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
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const chartContainerProps = {
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
  };

  const axisClickHandlerProps = {
    onAxisClick,
  };

  const gridProps = {
    vertical: grid?.vertical,
    horizontal: grid?.horizontal,
  };

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps = {
    id: clipPathId,
  };

  const areaPlotProps = {
    slots,
    slotProps,
    onAreaClick,
    skipAnimation,
  };

  const linePlotProps = {
    slots,
    slotProps,
    onLineClick,
    skipAnimation,
  };

  const markPlotProps = {
    slots,
    slotProps,
    onMarkClick,
    skipAnimation,
  };

  const overlayProps = {
    slots,
    slotProps,
    loading,
  };

  const chartsAxisProps = {
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    slots,
    slotProps,
  };

  const axisHighlightProps = {
    x: 'line' as const,
    ...axisHighlight,
  };

  const lineHighlightPlotProps = {
    slots,
    slotProps,
  };

  const legendProps = {
    ...legend,
    slots,
    slotProps,
  };

  const tooltipProps = {
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
