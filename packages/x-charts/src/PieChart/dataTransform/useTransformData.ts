'use client';
import * as React from 'react';
import {
  type ComputedPieRadius,
  type DefaultizedPieSeriesType,
  type DefaultizedPieValueType,
  type PieItemId,
  type PieItemIdentifier,
} from '../../models/seriesType/pie';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { useIsItemFocusedGetter } from '../../hooks/useIsItemFocusedGetter';
import { deg2rad } from '../../internals/angleConversion';

export interface AnimatedObject {
  innerRadius: number;
  outerRadius: number;
  arcLabelRadius: number;
  cornerRadius: number;
  startAngle: number;
  endAngle: number;
  paddingAngle: number;
}

export interface ValueWithHighlight extends Omit<DefaultizedPieValueType, 'id'>, AnimatedObject {
  seriesId: PieItemId;
  dataIndex: number;
  isFaded: boolean;
  isHighlighted: boolean;
  isFocused: boolean;
  onClick: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
}

export function useTransformData(
  series: Pick<
    DefaultizedPieSeriesType,
    'cornerRadius' | 'paddingAngle' | 'id' | 'highlighted' | 'faded' | 'data'
  > &
    ComputedPieRadius & {
      onItemClick?: (
        event: React.MouseEvent<SVGPathElement, MouseEvent>,
        pieItemIdentifier: PieItemIdentifier,
        item: DefaultizedPieValueType,
      ) => void;
    },
) {
  const {
    id: seriesId,
    data,
    faded,
    highlighted,
    paddingAngle: basePaddingAngle = 0,
    innerRadius: baseInnerRadius = 0,
    arcLabelRadius: baseArcLabelRadius,
    outerRadius: baseOuterRadius,
    cornerRadius: baseCornerRadius = 0,
    onItemClick,
  } = series;

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
        const isFocused = isItemFocused({ seriesType: 'pie', seriesId, dataIndex: itemIndex });

        const attributesOverride = {
          additionalRadius: 0,
          ...((isFaded && faded) || (isHighlighted && highlighted) || {}),
        };
        const paddingAngle = Math.max(
          0,
          deg2rad(attributesOverride.paddingAngle ?? basePaddingAngle),
        );
        const innerRadius = Math.max(0, attributesOverride.innerRadius ?? baseInnerRadius);

        const outerRadius = Math.max(
          0,
          attributesOverride.outerRadius ?? baseOuterRadius + attributesOverride.additionalRadius,
        );
        const cornerRadius = attributesOverride.cornerRadius ?? baseCornerRadius;

        const arcLabelRadius =
          attributesOverride.arcLabelRadius ??
          baseArcLabelRadius ??
          (innerRadius + outerRadius) / 2;

        const onClick = (event: React.MouseEvent<SVGPathElement, MouseEvent>) => {
          onItemClick?.(event, { type: 'pie', seriesId, dataIndex: itemIndex }, item);
        };

        return {
          ...item,
          ...attributesOverride,
          seriesId,
          dataIndex: itemIndex,
          isFaded,
          isHighlighted,
          isFocused,
          paddingAngle,
          innerRadius,
          outerRadius,
          cornerRadius,
          arcLabelRadius,
          onClick,
        };
      }),
    [
      baseCornerRadius,
      baseInnerRadius,
      baseOuterRadius,
      basePaddingAngle,
      baseArcLabelRadius,
      data,
      faded,
      highlighted,
      isItemFaded,
      isItemHighlighted,
      isItemFocused,
      seriesId,
      onItemClick,
    ],
  );

  return dataWithHighlight;
}
