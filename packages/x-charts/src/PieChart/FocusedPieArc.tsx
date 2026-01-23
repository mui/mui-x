'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { usePieSeriesContext, usePieSeriesLayout } from '../hooks/usePieSeries';
import { PieArc, pieArcClasses, type PieArcProps } from './PieArc';
import { useItemHighlighted } from '../hooks/useItemHighlighted';
import { getModifiedArcProperties } from './dataTransform/getModifiedArcProperties';

export function FocusedPieArc(
  props: Partial<
    Omit<
      PieArcProps,
      'startAngle' | 'endAngle' | 'id' | 'dataIndex' | 'isFaded' | 'isHighlighted' | 'isFocused'
    >
  >,
) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();
  const pieSeriesLayout = usePieSeriesLayout();

  const { isHighlighted, isFaded } = useItemHighlighted(focusedItem);
  const pieSeries = usePieSeriesContext();

  if (focusedItem === null || focusedItem.type !== 'pie' || !pieSeries) {
    return null;
  }

  const series = pieSeries?.series[focusedItem.seriesId];
  const { center, radius } = pieSeriesLayout[focusedItem.seriesId];

  if (!series || !center || !radius) {
    return null;
  }

  const item = series.data[focusedItem.dataIndex];

  const { arcLabelRadius, ...arcSizes } = getModifiedArcProperties(
    series,
    pieSeriesLayout[focusedItem.seriesId],
    isHighlighted,
    isFaded,
  );

  return (
    <PieArc
      transform={`translate(${pieSeriesLayout[series.id].center.x}, ${pieSeriesLayout[series.id].center.y})`}
      startAngle={item.startAngle}
      endAngle={item.endAngle}
      color="transparent"
      pointerEvents="none"
      skipInteraction
      skipAnimation
      stroke={(theme.vars ?? theme).palette.text.primary}
      id={series.id}
      className={pieArcClasses.focusIndicator}
      dataIndex={focusedItem.dataIndex}
      isFaded={false}
      isHighlighted={false}
      isFocused={false}
      strokeWidth={3}
      {...arcSizes}
      {...props}
    />
  );
}
