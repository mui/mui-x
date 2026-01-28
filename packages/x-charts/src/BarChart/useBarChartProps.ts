'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { type BarChartProps, type BarSeries } from './BarChart';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { type ChartContainerProps } from '../ChartContainer';
import { type BarPlotProps } from './BarPlot';
import { type ChartsGridProps } from '../ChartsGrid';
import { type ChartsClipPathProps } from '../ChartsClipPath';
import { type ChartsOverlayProps } from '../ChartsOverlay';
import { type ChartsAxisProps } from '../ChartsAxis';
import { type ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { type ChartsLegendSlotExtension } from '../ChartsLegend';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import type { AxisConfig, ChartsXAxisProps, ChartsYAxisProps } from '../models/axis';
import { BAR_CHART_PLUGINS, type BarChartPluginSignatures } from './BarChart.plugins';

export interface UseBarChartPropsExtensions {}

export type UseBarChartProps = Omit<BarChartProps, 'series'> &
  Omit<
    {
      series: ReadonlyArray<BarSeries>;
    },
    keyof UseBarChartPropsExtensions
  > &
  UseBarChartPropsExtensions;

/**
 * A helper function that extracts BarChartProps from the input props
 * and returns an object with props for the children components of BarChart.
 *
 * @param props The input props for BarChart
 * @returns An object with props for the children components of BarChart
 */
export const useBarChartProps = (props: UseBarChartProps) => {
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
    axisHighlight,
    grid,
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
    className,
    hideLegend,
    showToolbar,
    brushConfig,
    renderer,
    ...other
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const hasHorizontalSeries =
    layout === 'horizontal' ||
    (layout === undefined && series.some((item) => item.layout === 'horizontal'));

  const defaultBandXAxis: AxisConfig<'band', number, ChartsXAxisProps>[] = React.useMemo(
    () => [
      {
        id: DEFAULT_X_AXIS_KEY,
        scaleType: 'band',
        data: Array.from(
          { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
          (_, index) => index,
        ),
      },
    ],
    [dataset, series],
  );

  const defaultBandYAxis: AxisConfig<'band', number, ChartsYAxisProps>[] = React.useMemo(
    () => [
      {
        id: DEFAULT_Y_AXIS_KEY,
        scaleType: 'band',
        data: Array.from(
          { length: Math.max(...series.map((s) => (s.data ?? dataset ?? []).length)) },
          (_, index) => index,
        ),
      },
    ],
    [dataset, series],
  );

  const seriesWithDefault = React.useMemo(
    () =>
      series.map((s) => ({
        type: 'bar' as const,
        ...s,
        layout: hasHorizontalSeries ? ('horizontal' as const) : ('vertical' as const),
      })),
    [hasHorizontalSeries, series],
  );

  const defaultXAxis = hasHorizontalSeries ? undefined : defaultBandXAxis;
  const processedXAxis = React.useMemo(() => {
    if (!xAxis) {
      return defaultXAxis;
    }

    return hasHorizontalSeries
      ? xAxis
      : xAxis.map((axis) => ({ scaleType: 'band' as const, ...axis }));
  }, [defaultXAxis, hasHorizontalSeries, xAxis]);

  const defaultYAxis = hasHorizontalSeries ? defaultBandYAxis : undefined;
  const processedYAxis = React.useMemo(() => {
    if (!yAxis) {
      return defaultYAxis;
    }

    return hasHorizontalSeries
      ? yAxis.map((axis) => ({ scaleType: 'band' as const, ...axis }))
      : yAxis;
  }, [defaultYAxis, hasHorizontalSeries, yAxis]);

  const chartContainerProps: ChartContainerProps<'bar', BarChartPluginSignatures> = {
    ...other,
    series: seriesWithDefault,
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: processedXAxis,
    yAxis: processedYAxis,
    highlightedItem,
    onHighlightChange,
    disableAxisListener:
      slotProps?.tooltip?.trigger !== 'axis' &&
      axisHighlight?.x === 'none' &&
      axisHighlight?.y === 'none',
    className,
    skipAnimation,
    brushConfig,
    plugins: BAR_CHART_PLUGINS,
  };

  const barPlotProps: BarPlotProps = {
    onItemClick,
    slots,
    slotProps,
    borderRadius,
    renderer,
    barLabel,
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

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const chartsAxisProps: ChartsAxisProps = {
    slots,
    slotProps,
  };

  const axisHighlightProps: ChartsAxisHighlightProps = {
    ...(hasHorizontalSeries ? ({ y: 'band' } as const) : ({ x: 'band' } as const)),
    ...axisHighlight,
  };

  const legendProps: ChartsLegendSlotExtension = {
    slots,
    slotProps,
  };

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    legendPosition: props.slotProps?.legend?.position,
    legendDirection: props.slotProps?.legend?.direction,
    hideLegend: props.hideLegend ?? false,
  };

  return {
    chartsWrapperProps,
    chartContainerProps,
    barPlotProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    legendProps,
    children,
  };
};
