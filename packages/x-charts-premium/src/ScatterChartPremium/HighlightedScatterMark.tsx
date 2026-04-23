'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  getValueToPositionMapper,
  useScatterSeriesContext,
  useXAxes,
  useYAxes,
} from '@mui/x-charts/hooks';
import { selectorChartsHighlightedItem, useStore } from '@mui/x-charts/internals';

/**
 * Draws an SVG ring around the currently highlighted scatter point.
 * Used by the WebGL renderer, where the point itself is rasterized off the SVG tree —
 * so the highlight has to be drawn in SVG and positioned via the same axis scales the
 * WebGL plot uses.
 */
export function HighlightedScatterMark(props: React.SVGAttributes<SVGCircleElement>) {
  const theme = useTheme();
  const store = useStore();
  const highlightedItem = store.use(selectorChartsHighlightedItem);
  const scatterSeries = useScatterSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  if (
    !highlightedItem ||
    highlightedItem.type !== 'scatter' ||
    highlightedItem.dataIndex === undefined ||
    !scatterSeries
  ) {
    return null;
  }

  const series = scatterSeries.series[highlightedItem.seriesId];
  if (!series) {
    return null;
  }

  const xAxisId = series.xAxisId ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? yAxisIds[0];

  const getXPosition = getValueToPositionMapper(xAxis[xAxisId].scale);
  const getYPosition = getValueToPositionMapper(yAxis[yAxisId].scale);

  const scatterPoint = series.data[highlightedItem.dataIndex];
  if (!scatterPoint) {
    return null;
  }

  const cx = getXPosition(scatterPoint.x);
  const cy = getYPosition(scatterPoint.y);
  const r = series.markerSize / 2;

  return (
    <circle
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={1}
      cx={cx}
      cy={cy}
      r={r}
      pointerEvents="none"
      {...props}
    />
  );
}
