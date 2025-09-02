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
import type { ChartsWrapperProps } from '../ChartsWrapper';
import type { AxisConfig, ChartsXAxisProps, ChartsYAxisProps } from '../models/axis';
import { BAR_CHART_PLUGINS, BarChartPluginsSignatures } from './BarChart.plugins';
import { applyChartDownsampling } from '../internals/downsample';

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
    showToolbar,
    downsample,
    ...rest
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const hasHorizontalSeries =
    layout === 'horizontal' ||
    (layout === undefined && series.some((item) => item.layout === 'horizontal'));

  // Apply chart-level downsampling to series and axis data
  const { seriesWithDownsampling, processedXAxis, processedYAxis } = React.useMemo(() => {
    if (!downsample) {
      return {
        seriesWithDownsampling: series,
        processedXAxis: xAxis,
        processedYAxis: yAxis,
      };
    }

    // Extract series data for downsampling
    const seriesData = series.map((s) => s.data || []);

    // For bar charts, we need to handle the axis that contains categorical data
    // In vertical layout: x-axis has categories, y-axis has values
    // In horizontal layout: y-axis has categories, x-axis has values

    if (hasHorizontalSeries) {
      // Horizontal bars: downsample y-axis data
      const defaultYAxisData = Array.from(
        { length: Math.max(...seriesData.map((data) => data.length)) },
        (_, index) => index,
      );
      const yAxisData = yAxis?.[0]?.data || defaultYAxisData;

      const { seriesData: downsampledSeriesData, axisData: downsampledAxisData } =
        applyChartDownsampling(seriesData, yAxisData, downsample);

      return {
        seriesWithDownsampling: series.map((s, index) => ({
          ...s,
          data: downsampledSeriesData[index] || [],
        })),
        processedXAxis: xAxis,
        processedYAxis: yAxis
          ? yAxis.map((axis, axisIndex) => ({
              ...axis,
              data: axisIndex === 0 ? downsampledAxisData : axis.data,
            }))
          : [
              {
                id: DEFAULT_Y_AXIS_KEY,
                scaleType: 'band' as const,
                data: downsampledAxisData,
              },
            ],
      };
    }

    // Vertical bars: downsample x-axis data
    const defaultXAxisData = Array.from(
      { length: Math.max(...seriesData.map((data) => data.length)) },
      (_, index) => index,
    );
    const xAxisData = xAxis?.[0]?.data || defaultXAxisData;

    const { seriesData: downsampledSeriesData, axisData: downsampledAxisData } =
      applyChartDownsampling(seriesData, xAxisData, downsample);

    return {
      seriesWithDownsampling: series.map((s, index) => ({
        ...s,
        data: downsampledSeriesData[index] || [],
      })),
      processedXAxis: xAxis
        ? xAxis.map((axis, axisIndex) => ({
            ...axis,
            data: axisIndex === 0 ? downsampledAxisData : axis.data,
          }))
        : [
            {
              id: DEFAULT_X_AXIS_KEY,
              scaleType: 'band' as const,
              data: downsampledAxisData,
            },
          ],
      processedYAxis: yAxis,
    };
  }, [series, xAxis, yAxis, downsample, hasHorizontalSeries]);

  const defaultBandXAxis: AxisConfig<'band', number, ChartsXAxisProps>[] = React.useMemo(
    () => [
      {
        id: DEFAULT_X_AXIS_KEY,
        scaleType: 'band',
        data: Array.from(
          {
            length: Math.max(
              ...seriesWithDownsampling.map((s) => (s.data ?? dataset ?? []).length),
            ),
          },
          (_, index) => index,
        ),
      },
    ],
    [dataset, seriesWithDownsampling],
  );

  const defaultBandYAxis: AxisConfig<'band', number, ChartsYAxisProps>[] = React.useMemo(
    () => [
      {
        id: DEFAULT_Y_AXIS_KEY,
        scaleType: 'band',
        data: Array.from(
          {
            length: Math.max(
              ...seriesWithDownsampling.map((s) => (s.data ?? dataset ?? []).length),
            ),
          },
          (_, index) => index,
        ),
      },
    ],
    [dataset, seriesWithDownsampling],
  );

  const seriesWithDefault = React.useMemo(
    () =>
      seriesWithDownsampling.map((s) => ({
        type: 'bar' as const,
        ...s,
        layout: hasHorizontalSeries ? ('horizontal' as const) : ('vertical' as const),
      })),
    [hasHorizontalSeries, seriesWithDownsampling],
  );

  const defaultXAxis = hasHorizontalSeries ? undefined : defaultBandXAxis;
  const finalProcessedXAxis = React.useMemo(() => {
    // Use downsampled axes if available, otherwise use original logic
    if (processedXAxis) {
      return processedXAxis;
    }

    if (!xAxis) {
      return defaultXAxis;
    }

    return hasHorizontalSeries
      ? xAxis
      : xAxis.map((axis) => ({ scaleType: 'band' as const, ...axis }));
  }, [defaultXAxis, hasHorizontalSeries, xAxis, processedXAxis]);

  const defaultYAxis = hasHorizontalSeries ? defaultBandYAxis : undefined;
  const finalProcessedYAxis = React.useMemo(() => {
    // Use downsampled axes if available, otherwise use original logic
    if (processedYAxis) {
      return processedYAxis;
    }

    if (!yAxis) {
      return defaultYAxis;
    }

    return hasHorizontalSeries
      ? yAxis.map((axis) => ({ scaleType: 'band' as const, ...axis }))
      : yAxis;
  }, [defaultYAxis, hasHorizontalSeries, yAxis, processedYAxis]);

  const chartContainerProps: ChartContainerProps<'bar', BarChartPluginsSignatures> = {
    ...rest,
    series: seriesWithDefault,
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: finalProcessedXAxis,
    yAxis: finalProcessedYAxis,
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
