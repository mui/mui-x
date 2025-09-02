'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsClipPathProps } from '../ChartsClipPath';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendSlotExtension } from '../ChartsLegend';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { ChartContainerProps } from '../ChartContainer';
import { AreaPlotProps } from './AreaPlot';
import type { LineChartProps } from './LineChart';
import { LineHighlightPlotProps } from './LineHighlightPlot';
import { LinePlotProps } from './LinePlot';
import { MarkPlotProps } from './MarkPlot';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import { LINE_CHART_PLUGINS, LineChartPluginsSignatures } from './LineChart.plugins';
import { applyChartDownsampling } from '../internals/downsample';

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
    onAreaClick,
    onLineClick,
    onMarkClick,
    axisHighlight,
    disableLineItemHighlight,
    hideLegend,
    grid,
    children,
    slots,
    slotProps,
    skipAnimation,
    loading,
    highlightedItem,
    onHighlightChange,
    className,
    showToolbar,
    downsample,
    ...other
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  // Apply chart-level downsampling to series and axis data
  const { seriesWithDownsampling, processedXAxis } = React.useMemo(() => {
    if (!downsample) {
      return {
        seriesWithDownsampling: series.map((s) => ({
          disableHighlight: !!disableLineItemHighlight,
          type: 'line' as const,
          ...s,
        })),
        processedXAxis: xAxis,
      };
    }

    // Extract series data for downsampling
    const seriesData = series.map((s) => s.data || []);

    // Use the first xAxis data or generate default indices
    const defaultXAxisData = Array.from(
      { length: Math.max(...seriesData.map((data) => data.length)) },
      (_, index) => index,
    );
    const xAxisData = xAxis?.[0]?.data || defaultXAxisData;

    // Apply chart-level downsampling
    const { seriesData: downsampledSeriesData, axisData: downsampledAxisData } =
      applyChartDownsampling(seriesData, xAxisData, downsample);

    return {
      seriesWithDownsampling: series.map((s, index) => ({
        disableHighlight: !!disableLineItemHighlight,
        type: 'line' as const,
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
              scaleType: 'point' as const,
              data: downsampledAxisData,
            },
          ],
    };
  }, [series, xAxis, downsample, disableLineItemHighlight]);

  const chartContainerProps: ChartContainerProps<'line', LineChartPluginsSignatures> = {
    ...other,
    series: seriesWithDownsampling,
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: processedXAxis || [
      {
        id: DEFAULT_X_AXIS_KEY,
        scaleType: 'point',
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
    yAxis,
    highlightedItem,
    onHighlightChange,
    disableAxisListener:
      slotProps?.tooltip?.trigger !== 'axis' &&
      axisHighlight?.x === 'none' &&
      axisHighlight?.y === 'none',
    className,
    skipAnimation,
    plugins: LINE_CHART_PLUGINS,
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
  };

  const linePlotProps: LinePlotProps = {
    slots,
    slotProps,
    onItemClick: onLineClick,
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
    children,
  };
};
