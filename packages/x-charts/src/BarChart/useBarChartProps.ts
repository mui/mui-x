'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import type { BarChartProps } from './BarChart';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { ChartContainerProps } from '../ChartContainer';
import { BarPlotProps } from './BarPlot';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsClipPathProps } from '../ChartsClipPath';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsLegendSlotExtension } from '../ChartsLegend';
import type { ChartsWrapperProps } from '../internals/components/ChartsWrapper';
import type { AxisConfig, ChartsXAxisProps, ChartsYAxisProps } from '../models/axis';
import { BAR_CHART_PLUGINS, BarChartPluginsSignatures } from './BarChart.plugins';

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
    ...rest
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

  const chartContainerProps: ChartContainerProps<'bar', BarChartPluginsSignatures> = {
    ...rest,
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
    plugins: BAR_CHART_PLUGINS,
  };

  const barPlotProps: BarPlotProps = {
    onItemClick,
    slots,
    slotProps,
    borderRadius,
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
