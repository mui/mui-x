'use client';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';
import { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import { ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { ChartsLegendSlotExtension } from '@mui/x-charts/ChartsLegend';
import useId from '@mui/utils/useId';
import { ChartsClipPathProps } from '@mui/x-charts/ChartsClipPath';
import { ChartsWrapperProps, defaultizeMargin } from '@mui/x-charts/internals';
import { ChartsAxisHighlightProps } from '@mui/x-charts/ChartsAxisHighlight';
import { FunnelPlotProps } from './FunnelPlot';
import type { FunnelChartProps } from './FunnelChart';
import { ChartContainerProProps } from '../ChartContainerPro';

const defaultMargin = { top: 20, bottom: 20, left: 20, right: 20 };

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
    margin: marginProps,
    colors,
    sx,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    onItemClick,
    highlightedItem,
    onHighlightChange,
    className,
    hideLegend,
    axisHighlight,
    apiRef,
    ...rest
  } = props;
  const margin = defaultizeMargin(marginProps, defaultMargin);

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const defaultBandAxisConfig = {
    scaleType: 'band',
    categoryGapRatio: 0,
    data: Array.from(
      { length: Math.max(...series.map((s) => (s.data ?? []).length)) },
      (_, index) => index,
    ),
  } as const;

  const defaultLinearAxisConfig = {
    scaleType: 'linear',
    domainLimit: 'strict',
  } as const;

  const isHorizontal = series.some((s) => s.layout === 'horizontal');

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
    xAxis: xAxis?.map((axis) => ({
      ...(axis?.scaleType === 'band' || isHorizontal
        ? defaultBandAxisConfig
        : defaultLinearAxisConfig),
      ...axis,
    })) ?? [{ id: DEFAULT_X_AXIS_KEY, ...(isHorizontal ? defaultBandAxisConfig : {}) }],
    yAxis: yAxis?.map((axis) => ({
      ...(axis?.scaleType === 'band' || !isHorizontal
        ? defaultBandAxisConfig
        : defaultLinearAxisConfig),
      ...axis,
    })) ?? [{ id: DEFAULT_Y_AXIS_KEY, ...(isHorizontal ? {} : defaultBandAxisConfig) }],
    sx,
    highlightedItem,
    onHighlightChange,
    className,
    apiRef,
  };

  const funnelPlotProps: FunnelPlotProps = {
    onItemClick,
    slots,
    slotProps,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const chartsAxisProps: ChartsAxisProps = {
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

  const axisHighlightProps: ChartsAxisHighlightProps = {
    ...axisHighlight,
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
    axisHighlightProps,
    children,
  };
};
