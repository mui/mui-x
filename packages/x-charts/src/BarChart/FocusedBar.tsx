'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { useBarSeriesContext, useXAxes, useYAxes } from '../hooks';
import { getBandSize, getValueCoordinate } from './useBarPlotData';
import { ComputedAxis } from '../models/axis';

export function FocusedBar(props: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();

  const barSeries = useBarSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  if (focusedItem === null || focusedItem.seriesType !== 'bar' || !barSeries) {
    return null;
  }

  const series = barSeries?.series[focusedItem.seriesId];

  const xAxisId = series.xAxisId ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? yAxisIds[0];

  const xAxisConfig = xAxis[xAxisId];
  const yAxisConfig = yAxis[yAxisId];

  const verticalLayout = barSeries.series[focusedItem.seriesId].layout === 'vertical';

  const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;

  const xScale = xAxisConfig.scale;
  const yScale = yAxisConfig.scale;
  const bandWidth = baseScaleConfig.scale.bandwidth();

  const { barWidth, offset } = getBandSize({
    bandWidth,
    numberOfGroups: barSeries.stackingGroups.length,
    gapRatio: baseScaleConfig.barGapRatio,
  });
  const groupIndex = barSeries.stackingGroups.findIndex((group) =>
    group.ids.includes(focusedItem.seriesId),
  );
  const barOffset = groupIndex * (barWidth + offset);

  const baseValue = baseScaleConfig.data?.[focusedItem.dataIndex];

  if (baseValue == null || series.data[focusedItem.dataIndex] == null) {
    return null;
  }

  const values = series.stackedData[focusedItem.dataIndex];
  const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

  const minValueCoord = Math.round(Math.min(...valueCoordinates));
  const maxValueCoord = Math.round(Math.max(...valueCoordinates));

  const { barSize, startCoordinate } = getValueCoordinate(
    verticalLayout,
    minValueCoord,
    maxValueCoord,
    series.data[focusedItem.dataIndex],
    series.minBarSize,
  );

  const x = verticalLayout ? xScale(baseValue)! + barOffset : startCoordinate;
  const y = verticalLayout ? startCoordinate : yScale(baseValue)! + barOffset;
  const height = verticalLayout ? barSize : barWidth;
  const width = verticalLayout ? barWidth : barSize;

  return (
    <rect
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      x={x - 3}
      y={y - 3}
      width={width + 6}
      height={height + 6}
      rx={3}
      ry={3}
      {...props}
    />
  );
}
