'use client';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';
import { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { ChartsLegendSlotExtension } from '@mui/x-charts/ChartsLegend';
import useId from '@mui/utils/useId';
import { ChartsClipPathProps } from '@mui/x-charts/ChartsClipPath';
import { ChartsWrapperProps } from '@mui/x-charts/internals';
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

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const defaultBandAxisConfig = {
    scaleType: 'band',
    categoryGapRatio: 0,
    data: Array.from(
      { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
      (_, index) => index,
    ),
  } as const;

  const defaultOtherAxisConfig = {
    scaleType: 'linear',
    domainLimit: 'strict',
  } as const;

  const chartContainerProps: ChartContainerProProps<'funnel'> = {
    ...rest,
    series: series.map((s) => ({
      type: 'funnel' as const,
      ...s,
    })),
    width,
    height,
    margin,
    colors,
    dataset,
    // TODO: Remove default band and allow items height to adapt to the chart height
    xAxis: xAxis?.map((axis) => ({
      ...(axis?.scaleType === 'band' ? defaultBandAxisConfig : defaultOtherAxisConfig),
      ...axis,
    })) ?? [{ id: DEFAULT_X_AXIS_KEY, ...defaultOtherAxisConfig }],
    yAxis: yAxis?.map((axis) => ({
      ...(axis?.scaleType === 'band' ? defaultBandAxisConfig : defaultOtherAxisConfig),
      ...axis,
    })) ?? [{ id: DEFAULT_Y_AXIS_KEY, ...defaultOtherAxisConfig }],
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

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps: ChartsClipPathProps = {
    id: clipPathId,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    legendPosition: props.slotProps?.legend?.position,
    legendDirection: props.slotProps?.legend?.direction,
  };

  return {
    chartContainerProps,
    funnelPlotProps,
    overlayProps,
    chartsAxisProps,
    legendProps,
    clipPathGroupProps,
    clipPathProps,
    chartsWrapperProps,
    children,
  };
};
