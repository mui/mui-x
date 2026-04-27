'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import {
  getValueToPositionMapper,
  useScatterSeriesContext,
  useXAxes,
  useYAxes,
} from '../hooks';
import { useChartsContext } from '../context/ChartsProvider';
import { selectorChartsHighlightedItem } from '../internals/plugins/featurePlugins/useChartHighlight';
import { useStore } from '../internals/store/useStore';
import { useUtilityClasses } from './scatterClasses';

/**
 * Draws an SVG ring around the currently highlighted scatter point.
 * Used by renderers where the point itself is rasterized off the SVG tree
 * (for example WebGL or `svg-batch`), so the highlight has to be drawn in SVG
 * and positioned via the same axis scales the underlying renderer uses.
 */
export function HighlightedScatterMark({
  className,
  ...props
}: React.SVGAttributes<SVGCircleElement>) {
  const theme = useTheme();
  const store = useStore();
  const highlightedItem = store.use(selectorChartsHighlightedItem);
  const scatterSeries = useScatterSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { instance } = useChartsContext();
  const classes = useUtilityClasses();

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

  if (!instance.isPointInside(cx, cy)) {
    return null;
  }

  return (
    <circle
      className={clsx(classes.highlightedMark, className)}
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={1}
      cx={cx}
      cy={cy}
      r={series.markerSize}
      pointerEvents="none"
      {...props}
    />
  );
}
