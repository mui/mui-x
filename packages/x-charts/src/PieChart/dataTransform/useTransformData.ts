'use client';
import * as React from 'react';
import {
  type ComputedPieRadius,
  type DefaultizedPieSeriesType,
  type DefaultizedPieValueType,
} from '../../models/seriesType/pie';
import { useItemHighlightStateGetter } from '../../hooks/useItemHighlightStateGetter';
import { useIsItemFocusedGetter } from '../../hooks/useIsItemFocusedGetter';
import { getModifiedArcProperties } from './getModifiedArcProperties';

export interface AnimatedObject {
  innerRadius: number;
  outerRadius: number;
  arcLabelRadius: number;
  cornerRadius: number;
  startAngle: number;
  endAngle: number;
  paddingAngle: number;
}

export interface ValueWithHighlight extends DefaultizedPieValueType, AnimatedObject {
  dataIndex: number;
  isFaded: boolean;
  isHighlighted: boolean;
  isFocused: boolean;
}

export function useTransformData(
  series: Pick<
    DefaultizedPieSeriesType,
    'cornerRadius' | 'paddingAngle' | 'id' | 'highlighted' | 'faded' | 'data'
  > &
    ComputedPieRadius,
) {
  const { id: seriesId, data, faded, highlighted } = series;

  const getHighlightState = useItemHighlightStateGetter();
  const isItemFocused = useIsItemFocusedGetter();

  const dataWithHighlight: ValueWithHighlight[] = React.useMemo(
    () =>
      data.map((item, itemIndex) => {
        const identifier = {
          type: 'pie' as const,
          seriesId,
          dataIndex: itemIndex,
        };
        const highlightState = getHighlightState(identifier);
        const isHighlighted = highlightState === 'highlighted';
        const isFaded = highlightState === 'faded';
        const isFocused = isItemFocused(identifier);

        // TODO v9: Replace the second argument with the result of useSeriesLayout
        const arcSizes = getModifiedArcProperties(
          series,
          {
            radius: {
              inner: series.innerRadius ?? 0,
              outer: series.outerRadius,
              label: series.arcLabelRadius ?? 0,
              available: 0,
            },
          },
          isHighlighted,
          isFaded,
        );
        const attributesOverride = {
          additionalRadius: 0,
          ...((isFaded && faded) || (isHighlighted && highlighted) || {}),
        };

        return {
          ...item,
          ...attributesOverride,
          dataIndex: itemIndex,
          isFaded,
          isHighlighted,
          isFocused,
          ...arcSizes,
        };
      }),
    [data, seriesId, getHighlightState, isItemFocused, series, faded, highlighted],
  );

  return dataWithHighlight;
}
