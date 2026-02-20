'use client';
import * as React from 'react';
import {
  type ComputedPieRadius,
  type DefaultizedPieSeriesType,
  type DefaultizedPieValueType,
} from '../../models/seriesType/pie';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { useIsItemFocusedGetter } from '../../hooks/useIsItemFocusedGetter';
import { getModifiedArcProperties } from './getModifiedArcProperties';
import type { SeriesId } from '../../models';

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
  seriesId: SeriesId;
}

export function useTransformData(
  series: Pick<
    DefaultizedPieSeriesType,
    'cornerRadius' | 'paddingAngle' | 'id' | 'highlighted' | 'faded' | 'data'
  > &
    ComputedPieRadius,
) {
  const { id: seriesId, data, faded, highlighted } = series;

  const { isFaded: isItemFaded, isHighlighted: isItemHighlighted } = useItemHighlightedGetter();
  const isItemFocused = useIsItemFocusedGetter();

  const dataWithHighlight: ValueWithHighlight[] = React.useMemo(
    () =>
      data.map((item, itemIndex) => {
        const currentItem = {
          seriesId,
          dataIndex: itemIndex,
        };
        const isHighlighted = isItemHighlighted(currentItem);
        const isFaded = !isHighlighted && isItemFaded(currentItem);
        const isFocused = isItemFocused({ type: 'pie', seriesId, dataIndex: itemIndex });

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
          seriesId,
          ...arcSizes,
        };
      }),
    [data, seriesId, isItemHighlighted, isItemFaded, isItemFocused, series, faded, highlighted],
  );

  return dataWithHighlight;
}
