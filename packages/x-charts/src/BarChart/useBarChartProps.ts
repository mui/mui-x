import useId from '@mui/utils/useId';
import type { BarChartProps } from './BarChart';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';

/**
 * A helper function that extracts BarChartProps from the input props
 * and returns an object with props for the children components of BarChart.
 *
 * @param props The input props for BarChart
 * @returns An object with props for the children components of BarChart
 */
export const useBarChartProps = (props: BarChartProps) => {
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
    axisHighlight,
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
    layout,
    onItemClick,
    highlightedItem,
    onHighlightChange,
    borderRadius,
    barLabel,
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const hasHorizontalSeries =
    layout === 'horizontal' ||
    (layout === undefined && series.some((item) => item.layout === 'horizontal'));

  const defaultAxisConfig = {
    scaleType: 'band',
    data: Array.from(
      { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
      (_, index) => index,
    ),
  } as const;

  const chartContainerProps = {
    series: series.map((s) => ({
      type: 'bar' as const,
      ...s,
      layout: hasHorizontalSeries ? ('horizontal' as const) : ('vertical' as const),
    })),
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis:
      xAxis ??
      (hasHorizontalSeries ? undefined : [{ id: DEFAULT_X_AXIS_KEY, ...defaultAxisConfig }]),
    yAxis:
      yAxis ??
      (hasHorizontalSeries ? [{ id: DEFAULT_Y_AXIS_KEY, ...defaultAxisConfig }] : undefined),
    sx,
    highlightedItem,
    onHighlightChange,
    disableAxisListener:
      tooltip?.trigger !== 'axis' &&
      axisHighlight?.x === 'none' &&
      axisHighlight?.y === 'none' &&
      !onAxisClick,
  };

  const barPlotProps = {
    onItemClick,
    slots,
    slotProps,
    skipAnimation,
    borderRadius,
    barLabel,
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
    ...(hasHorizontalSeries ? ({ y: 'band' } as const) : ({ x: 'band' } as const)),
    ...axisHighlight,
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
    barPlotProps,
    axisClickHandlerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    legendProps,
    tooltipProps,
    children,
  };
};
