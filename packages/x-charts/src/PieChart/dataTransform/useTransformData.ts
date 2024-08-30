import * as React from 'react';
import {
  ComputedPieRadius,
  DefaultizedPieSeriesType,
  DefaultizedPieValueType,
} from '../../models/seriesType/pie';
import { useHighlighted } from '../../context';

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
  isFaded: boolean;
  isHighlighted: boolean;
}

export function useTransformData(
  series: Pick<
    DefaultizedPieSeriesType,
    'cornerRadius' | 'paddingAngle' | 'id' | 'highlighted' | 'faded' | 'data'
  > &
    ComputedPieRadius,
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
  } = series;

  const { isFaded: isItemFaded, isHighlighted: isItemHighlighted } = useHighlighted();

  const dataWithHighlight: ValueWithHighlight[] = React.useMemo(
    () =>
      data.map((item, itemIndex) => {
        const currentItem = {
          seriesId,
          dataIndex: itemIndex,
        };
        const isHighlighted = isItemHighlighted(currentItem);
        const isFaded = !isHighlighted && isItemFaded(currentItem);

        const attributesOverride = {
          additionalRadius: 0,
          ...((isFaded && faded) || (isHighlighted && highlighted) || {}),
        };
        const paddingAngle = Math.max(
          0,
          (Math.PI * (attributesOverride.paddingAngle ?? basePaddingAngle)) / 180,
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

        return {
          ...item,
          ...attributesOverride,
          isFaded,
          isHighlighted,
          paddingAngle,
          innerRadius,
          outerRadius,
          cornerRadius,
          arcLabelRadius,
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
      seriesId,
    ],
  );

  return dataWithHighlight;
}
