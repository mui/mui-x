'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useStore } from '@mui/x-charts/internals';
import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { useFocusedItem } from '@mui/x-charts/hooks';
import { useFunnelSeriesContext } from '../hooks';
import { createPositionGetter } from './coordinateMapper';
import { getFunnelCurve, type Point } from './curves';
import {
  selectorChartXAxis,
  selectorChartYAxis,
  selectorFunnelGap,
} from './funnelAxisPlugin/useChartFunnelAxisRendering.selectors';
import { get2DExtrema } from './get2DExtrema';

export function FocusedFunnelSection(props: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();
  const store = useStore();
  const { axis: xAxis, axisIds: xAxisIds } = store.use(selectorChartXAxis);
  const { axis: yAxis, axisIds: yAxisIds } = store.use(selectorChartYAxis);

  const gap = store.use(selectorFunnelGap);

  const allFunnelSeries = useFunnelSeriesContext()?.series;

  if (!focusedItem || focusedItem.type !== 'funnel' || !allFunnelSeries) {
    return null;
  }

  const funnelSeries = allFunnelSeries[focusedItem.seriesId];

  const xAxisId = funnelSeries.xAxisId ?? xAxisIds[0];
  const yAxisId = funnelSeries.yAxisId ?? yAxisIds[0];

  const xScale = xAxis[xAxisId].scale;
  const yScale = yAxis[yAxisId].scale;

  const isHorizontal = funnelSeries.layout === 'horizontal';
  const baseScaleData = isHorizontal ? xAxis[xAxisId].data : yAxis[yAxisId].data;

  const xPosition = createPositionGetter(xScale, isHorizontal, gap, baseScaleData);
  const yPosition = createPositionGetter(yScale, !isHorizontal, gap, baseScaleData);

  const isIncreasing = funnelSeries.funnelDirection === 'increasing';

  const [minPoint, maxPoint] = get2DExtrema(funnelSeries.dataPoints, xPosition, yPosition);

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
