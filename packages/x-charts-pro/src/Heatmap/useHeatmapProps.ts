import { type ChartsWrapperProps } from '@mui/x-charts/ChartsWrapper';
import useId from '@mui/utils/useId';
import { interpolateRgbBasis } from '@mui/x-charts-vendor/d3-interpolate';
import * as React from 'react';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';
import {
  type ChartsLegendProps,
  type ChartsLegendSlotExtension,
  ContinuousColorLegend,
} from '@mui/x-charts/ChartsLegend';
import type { ChartsOverlayProps } from '@mui/x-charts/ChartsOverlay';
import { type ChartsClipPathProps } from '@mui/x-charts/ChartsClipPath';
import type { ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { HEATMAP_PLUGINS, type HeatmapPluginSignatures } from './Heatmap.plugins';
import { type HeatmapProps } from './Heatmap';
import { heatmapSeriesConfig } from './seriesConfig';
import { type ChartDataProviderProProps } from '../ChartDataProviderPro';
import { type HeatmapSeriesType } from '../models/seriesType';
import { type HeatmapPlotProps } from './HeatmapPlot';

export type UseHeatmapProps = HeatmapProps;

const seriesConfig = { heatmap: heatmapSeriesConfig };

// The GnBu: https://github.com/d3/d3-scale-chromatic/blob/main/src/sequential-multi/GnBu.js
const defaultColorMap = interpolateRgbBasis([
  '#f7fcf0',
  '#e0f3db',
  '#ccebc5',
  '#a8ddb5',
  '#7bccc4',
  '#4eb3d3',
  '#2b8cbe',
  '#0868ac',
  '#084081',
]);

function getDefaultDataForAxis(series: HeatmapProps['series'], dimension: number) {
  if (series?.[0]?.data === undefined || series[0].data.length === 0) {
    return [];
  }

  return Array.from(
    { length: Math.max(...series[0].data.map((dataPoint) => dataPoint[dimension])) + 1 },
    (_, index) => index,
  );
}
const getDefaultDataForXAxis = (series: HeatmapProps['series']) => getDefaultDataForAxis(series, 0);
const getDefaultDataForYAxis = (series: HeatmapProps['series']) => getDefaultDataForAxis(series, 1);

export function useHeatmapProps(props: UseHeatmapProps) {
  const {
    apiRef,
    xAxis,
    yAxis,
    zAxis,
    series,
    width,
    height,
    margin,
    colors,
    dataset,
    sx,
    onAxisClick,
    onItemClick,
    children,
    slots,
    slotProps,
    loading,
    highlightedItem,
    onHighlightChange,
    enableKeyboardNavigation,
    borderRadius,
    hideLegend,
  } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const xAxisWithDefault = React.useMemo(
    () =>
      (xAxis && xAxis.length > 0 ? xAxis : [{ id: DEFAULT_X_AXIS_KEY }]).map((axis) => ({
        scaleType: 'band' as const,
        categoryGapRatio: 0,
        ...axis,
        data: axis.data ?? getDefaultDataForXAxis(series),
      })),
    [series, xAxis],
  );

  const yAxisWithDefault = React.useMemo(
    () =>
      (yAxis && yAxis.length > 0 ? yAxis : [{ id: DEFAULT_Y_AXIS_KEY }]).map((axis) => ({
        scaleType: 'band' as const,
        categoryGapRatio: 0,
        ...axis,
        data: axis.data ?? getDefaultDataForYAxis(series),
      })),
    [series, yAxis],
  );

  const zAxisWithDefault = React.useMemo(
    () =>
      zAxis ?? [
        {
          colorMap: {
            type: 'continuous',
            min: 0,
            max: 100,
            color: defaultColorMap,
          },
        } as const,
      ],
    [zAxis],
  );

  const seriesWithDefault: HeatmapSeriesType[] = series.map((s) => ({
    type: 'heatmap',
    ...s,
  }));

  const chartsWrapperProps: Omit<ChartsWrapperProps, 'children'> = {
    sx,
    legendPosition: props.slotProps?.legend?.position,
    legendDirection: props.slotProps?.legend?.direction,
    hideLegend,
  };

  const chartDataProviderProProps: ChartDataProviderProProps<'heatmap', HeatmapPluginSignatures> = {
    apiRef,
    seriesConfig,
    series: seriesWithDefault,
    width,
    height,
    margin,
    xAxis: xAxisWithDefault,
    yAxis: yAxisWithDefault,
    zAxis: zAxisWithDefault,
    colors,
    dataset,
    disableAxisListener: true,
    highlightedItem,
    onHighlightChange,
    enableKeyboardNavigation,
    onAxisClick,
    onItemClick,
    plugins: HEATMAP_PLUGINS,
  };

  const heatmapPlotProps: HeatmapPlotProps = {
    borderRadius,
    slots,
    slotProps,
  };

  const overlayProps: ChartsOverlayProps = {
    slots,
    slotProps,
    loading,
  };

  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`,
  };

  const clipPathProps: ChartsClipPathProps = {
    id: clipPathId,
  };

  const chartsAxisProps: ChartsAxisProps = {
    slots,
    slotProps,
  };

  const legendProps: ChartsLegendProps | ChartsLegendSlotExtension = {
    slots: { ...slots, legend: slots?.legend ?? ContinuousColorLegend },
    slotProps: { legend: { labelPosition: 'extremes', ...slotProps?.legend } },
    sx: slotProps?.legend?.direction === 'vertical' ? { height: 150 } : { width: '50%' },
  };

  return {
    chartDataProviderProProps,
    chartsWrapperProps,
    heatmapPlotProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    legendProps,
    children,
  };
}
