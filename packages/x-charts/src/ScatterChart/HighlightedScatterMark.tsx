'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import { selectorChartsHighlightedItem } from '../internals/plugins/featurePlugins/useChartHighlight';
import { selectorChartDrawingArea } from '../internals/plugins/corePlugins/useChartDimensions';
import { useStore } from '../internals/store/useStore';
import { useUtilityClasses } from './scatterClasses';
import { useScatterItemPosition } from './useScatterItemPosition';

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
  const drawingArea = store.use(selectorChartDrawingArea);
  const classes = useUtilityClasses();

  const isHighlightedScatter =
    highlightedItem?.type === 'scatter' && highlightedItem.dataIndex !== undefined;
  const resolved = useScatterItemPosition(
    isHighlightedScatter
      ? { seriesId: highlightedItem.seriesId, dataIndex: highlightedItem.dataIndex! }
      : null,
  );

  if (!resolved) {
    return null;
  }

  const { cx, cy, series } = resolved;

  // Allow a markerSize margin around the drawing area so the highlight ring stays
  // visible at the edges (e.g. during keyboard navigation) without needing a clip-path.
  const margin = series.markerSize;
  if (
    cx < drawingArea.left - margin ||
    cx > drawingArea.left + drawingArea.width + margin ||
    cy < drawingArea.top - margin ||
    cy > drawingArea.top + drawingArea.height + margin
  ) {
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
