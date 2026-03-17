'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import { type ChartsAxisProps } from '../ChartsAxis';
import { type ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { type ChartsClipPathProps } from '../ChartsClipPath';
import { type ChartsGridProps } from '../ChartsGrid';
import { type ChartsLegendSlotExtension } from '../ChartsLegend';
import { type ChartsOverlayProps } from '../ChartsOverlay';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { type ChartContainerProps } from '../ChartContainer';
import { type AreaPlotProps } from './AreaPlot';
import type { LineChartProps } from './LineChart';
import { type LineHighlightPlotProps } from './LineHighlightPlot';
import { type LinePlotProps } from './LinePlot';
import { type MarkPlotProps } from './MarkPlot';
import type { ChartsWrapperProps } from '../ChartsWrapper';
import { LINE_CHART_PLUGINS, type LineChartPluginSignatures } from './LineChart.plugins';

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
    brushConfig,
    ...other
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const seriesWithDefault = React.useMemo(
    () =>
      series.map((s) => ({
        disableHighlight: !!disableLineItemHighlight,
        type: 'line' as const,
        ...s,
      })),
    [disableLineItemHighlight, series],
  );
  const chartContainerProps: ChartContainerProps<'line', LineChartPluginSignatures> = {
    ...other,
    series: seriesWithDefault,
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
    highlightedItem,
    onHighlightChange,
    disableAxisListener:
      slotProps?.tooltip?.trigger !== 'axis' &&
      axisHighlight?.x === 'none' &&
      axisHighlight?.y === 'none',
    className,
    skipAnimation,
    brushConfig,
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
    hideLegend: props.hideLegend ?? false,
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
