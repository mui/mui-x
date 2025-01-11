'use client';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';
import { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { ChartsLegendSlotExtension } from '@mui/x-charts/ChartsLegend';
import { FunnelPlotProps } from './FunnelPlot';
import type { FunnelChartProps } from './FunnelChart';
import { ChartContainerProProps } from '../ChartContainerPro';

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

  const defaultBandAxisConfig = {
    scaleType: 'band',
    data: Array.from(
      { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
      (_, index) => index,
    ),
  } as const;

  const chartContainerProps: ChartContainerProProps<'funnel'> = {
    ...rest,
    series: series.map((s) => ({
      type: 'funnel' as const,
      ...s,
      valueFormatter: s.valueFormatter ?? ((item) => item.value.toLocaleString()),
      layout: hasHorizontalSeries ? ('horizontal' as const) : ('vertical' as const),
    })),
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis:
      xAxis ??
      (hasHorizontalSeries ? [{ id: DEFAULT_X_AXIS_KEY, ...defaultBandAxisConfig }] : undefined),
    yAxis:
      yAxis ??
      (hasHorizontalSeries ? undefined : [{ id: DEFAULT_Y_AXIS_KEY, ...defaultBandAxisConfig }]),
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

  const legendProps: ChartsLegendSlotExtension = {
    slots,
    slotProps,
  };

  return {
    chartContainerProps,
    funnelPlotProps,
    overlayProps,
    chartsAxisProps,
    legendProps,
    children,
  };
};
