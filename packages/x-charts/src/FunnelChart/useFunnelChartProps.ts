'use client';
import type { FunnelChartProps } from './FunnelChart';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { ResponsiveChartContainerProps } from '../ResponsiveChartContainer';
import { FunnelPlotProps } from './FunnelPlot';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsTooltipProps } from '../ChartsTooltip';
import { ChartsLegendProps } from '../ChartsLegend';

/**
 * A helper function that extracts FunnelChartProps from the input props
 * and returns an object with props for the children components of FunnelChart.
 *
 * @param props The input props for FunnelChart
 * @returns An object with props for the children components of FunnelChart
 */
export const useFunnelChartProps = (props: FunnelChartProps) => {
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
    className,
    funnelLabel,
    ...rest
  } = props;

  const hasHorizontalSeries =
    layout === 'horizontal' ||
    (layout === undefined && series.some((item) => item.layout === 'horizontal'));

  const chartContainerProps: ResponsiveChartContainerProps = {
    ...rest,
    series: series.map((s) => ({
      type: 'funnel' as const,
      ...s,
      layout: hasHorizontalSeries ? ('horizontal' as const) : ('vertical' as const),
    })),
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: xAxis ?? (hasHorizontalSeries ? undefined : [{ id: DEFAULT_X_AXIS_KEY }]),
    yAxis: yAxis ?? (hasHorizontalSeries ? [{ id: DEFAULT_Y_AXIS_KEY }] : undefined),
    sx,
    highlightedItem,
    onHighlightChange,
    disableAxisListener: true,
    className,
  };

  const funnelPlotProps: FunnelPlotProps = {
    onItemClick,
    funnelLabel,
    slots,
    slotProps,
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

  const tooltipProps: ChartsTooltipProps<'funnel'> = {
    ...tooltip,
    trigger: tooltip?.trigger ?? 'item',
    slots,
    slotProps,
  };

  const legendProps: ChartsLegendProps = {
    slots,
    slotProps,
  };

  return {
    chartContainerProps,
    funnelPlotProps,
    overlayProps,
    chartsAxisProps,
    tooltipProps,
    legendProps,
    children,
  };
};
