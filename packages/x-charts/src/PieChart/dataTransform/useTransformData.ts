import * as React from 'react';
import { InteractionContext } from '../../context/InteractionProvider';
import {
  ComputedPieRadius,
  DefaultizedPieSeriesType,
  DefaultizedPieValueType,
} from '../../models/seriesType/pie';
import { getIsHighlighted, getIsFaded } from '../../hooks/useInteractionItemProps';

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
    'cornerRadius' | 'paddingAngle' | 'id' | 'highlightScope' | 'highlighted' | 'faded' | 'data'
  > &
    ComputedPieRadius,
) {
  const {
    id: seriesId,
    highlightScope,
    data,
    faded,
    highlighted,
    paddingAngle: basePaddingAngle = 0,
    innerRadius: baseInnerRadius = 0,
    arcLabelRadius: baseArcLabelRadius,
    outerRadius: baseOuterRadius,
    cornerRadius: baseCornerRadius = 0,
  } = series;

  const { item: highlightedItem } = React.useContext(InteractionContext);

  const getHighlightStatus = React.useCallback(
    (dataIndex: number) => {
      const isHighlighted = getIsHighlighted(
        highlightedItem,
        { type: 'pie', seriesId, dataIndex },
        highlightScope,
      );
      const isFaded =
        !isHighlighted &&
        getIsFaded(highlightedItem, { type: 'pie', seriesId, dataIndex }, highlightScope);

      return { isHighlighted, isFaded };
    },
    [highlightScope, highlightedItem, seriesId],
  );

  const dataWithHighlight: ValueWithHighlight[] = React.useMemo(
    () =>
      data.map((item, itemIndex) => {
        const { isHighlighted, isFaded } = getHighlightStatus(itemIndex);

        const attribuesOverride = {
          additionalRadius: 0,
          ...((isFaded && faded) || (isHighlighted && highlighted) || {}),
        };
        const paddingAngle = Math.max(
          0,
          (Math.PI * (attribuesOverride.paddingAngle ?? basePaddingAngle)) / 180,
        );
        const innerRadius = Math.max(0, attribuesOverride.innerRadius ?? baseInnerRadius);

        const outerRadius = Math.max(
          0,
          attribuesOverride.outerRadius ?? baseOuterRadius + attribuesOverride.additionalRadius,
        );
        const cornerRadius = attribuesOverride.cornerRadius ?? baseCornerRadius;

        const arcLabelRadius =
          attribuesOverride.arcLabelRadius ?? baseArcLabelRadius ?? (innerRadius + outerRadius) / 2;

        return {
          ...item,
          ...attribuesOverride,
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
      getHighlightStatus,
      highlighted,
    ],
  );

  return dataWithHighlight;
}
