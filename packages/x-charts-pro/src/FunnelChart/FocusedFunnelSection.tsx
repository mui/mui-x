'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import type { Point } from '@mui/x-charts/internals';
import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { useFocusedItem } from '@mui/x-charts/hooks';
import { useFunnelSeriesContext, useXAxis, useYAxis } from '../hooks';
import { createPositionGetter } from './coordinateMapper';
import { getFunnelCurve } from './curves/getFunnelCurve';

export function FocusedFunnelSection(props: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();

  const funnelSeries = useFunnelSeriesContext()?.series?.[focusedItem?.seriesId ?? ''];

  const xAxis = useXAxis(funnelSeries?.xAxisId);
  const yAxis = useYAxis(funnelSeries?.yAxisId);

  if (focusedItem === null || focusedItem.type !== 'funnel' || !funnelSeries) {
    return null;
  }

  const isHorizontal = funnelSeries.layout === 'horizontal';
  const baseScaleConfig = isHorizontal ? xAxis : yAxis;

  // FIXME gap should be obtained from the store.
  // Maybe moving it to the series would be a good idea similar to what we do with bar charts and their stackingGroups
  const gap = 0;

  const xPosition = createPositionGetter(xAxis.scale, isHorizontal, gap);
  const yPosition = createPositionGetter(yAxis.scale, !isHorizontal, gap);

  const isIncreasing = funnelSeries.funnelDirection === 'increasing';

  const allY = funnelSeries.dataPoints.flatMap((section) =>
    section.map((v) =>
      yPosition(
        v.y,
        focusedItem.dataIndex,
        baseScaleConfig.data?.[focusedItem.dataIndex],
        v.stackOffset,
        v.useBandWidth,
      ),
    ),
  );
  const allX = funnelSeries.dataPoints.flatMap((section) =>
    section.map((v) =>
      xPosition(
        v.x,
        focusedItem.dataIndex,
        baseScaleConfig.data?.[focusedItem.dataIndex],
        v.stackOffset,
        v.useBandWidth,
      ),
    ),
  );

  const minPoint = {
    x: Math.min(...allX),
    y: Math.min(...allY),
  };
  const maxPoint = {
    x: Math.max(...allX),
    y: Math.max(...allY),
  };

  const curve = getFunnelCurve(funnelSeries.curve, {
    isHorizontal,
    gap,
    position: focusedItem.dataIndex,
    sections: funnelSeries.dataPoints.length,
    borderRadius: funnelSeries.borderRadius,
    isIncreasing,
    min: minPoint,
    max: maxPoint,
  });

  const bandPoints = curve({} as any).processPoints(
    funnelSeries.dataPoints[focusedItem.dataIndex].map((v) => ({
      x: xPosition(
        v.x,
        focusedItem.dataIndex,
        baseScaleConfig.data?.[focusedItem.dataIndex],
        v.stackOffset,
        v.useBandWidth,
      ),
      y: yPosition(
        v.y,
        focusedItem.dataIndex,
        baseScaleConfig.data?.[focusedItem.dataIndex],
        v.stackOffset,
        v.useBandWidth,
      ),
    })),
  );

  const line = d3Line<Point>()
    .x((v) => v.x)
    .y((v) => v.y)
    .curve(curve);

  return (
    <path
      d={line(bandPoints)!}
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      {...props}
    />
  );
}
