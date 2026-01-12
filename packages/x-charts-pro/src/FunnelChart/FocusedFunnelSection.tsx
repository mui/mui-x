'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useStore, type Point } from '@mui/x-charts/internals';
import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { useFocusedItem } from '@mui/x-charts/hooks';
import { useFunnelSeriesContext, useXAxis, useYAxis } from '../hooks';
import { createPositionGetter } from './coordinateMapper';
import { getFunnelCurve } from './curves/getFunnelCurve';
import { selectorFunnelGap } from './funnelAxisPlugin/useChartFunnelAxisRendering.selectors';
import { getCornerPoints } from './getCornerPoints';

export function FocusedFunnelSection(props: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();
  const store = useStore();

  const gap = store.use(selectorFunnelGap);

  const funnelSeries = useFunnelSeriesContext()?.series?.[focusedItem?.seriesId ?? ''];

  const xAxis = useXAxis(funnelSeries?.xAxisId);
  const yAxis = useYAxis(funnelSeries?.yAxisId);

  if (!focusedItem || focusedItem.type !== 'funnel' || !funnelSeries) {
    return null;
  }

  const isHorizontal = funnelSeries.layout === 'horizontal';
  const baseScaleConfig = isHorizontal ? xAxis : yAxis;

  const xPosition = createPositionGetter(xAxis.scale, isHorizontal, gap, baseScaleConfig.data);
  const yPosition = createPositionGetter(yAxis.scale, !isHorizontal, gap, baseScaleConfig.data);

  const isIncreasing = funnelSeries.funnelDirection === 'increasing';

  const [minPoint, maxPoint] = getCornerPoints(funnelSeries.dataPoints, xPosition, yPosition);

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
      x: xPosition(v.x, focusedItem.dataIndex, v.stackOffset, v.useBandWidth),
      y: yPosition(v.y, focusedItem.dataIndex, v.stackOffset, v.useBandWidth),
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
