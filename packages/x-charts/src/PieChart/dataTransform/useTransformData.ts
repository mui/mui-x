import * as React from 'react';
import { InteractionContext } from '../../context/InteractionProvider';
import { DefaultizedPieSeriesType, DefaultizedPieValueType } from '../../models/seriesType/pie';
import { getIsHighlighted, getIsFaded } from '../../hooks/useInteractionItemProps';
import { DefaultizedProps } from '../../models/helpers';

export interface AnimatedObject {
  innerRadius: number;
  outerRadius: number;
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
  series: DefaultizedProps<
    Pick<
      DefaultizedPieSeriesType,
      | 'innerRadius'
      | 'outerRadius'
      | 'cornerRadius'
      | 'paddingAngle'
      | 'id'
      | 'highlightScope'
      | 'highlighted'
      | 'faded'
      | 'data'
    >,
    'outerRadius'
  >,
) {
  const {
    id: seriesId,
    highlightScope,
    data,
    faded,
    highlighted,
    paddingAngle: basePaddingAngle = 0,
    innerRadius: baseInnerRadius = 0,
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

        const attibuesOverride = {
          additionalRadius: 0,
          ...((isFaded && faded) || (isHighlighted && highlighted) || {}),
        };
        const paddingAngle = Math.max(
          0,
          (Math.PI * (attibuesOverride.paddingAngle ?? basePaddingAngle)) / 180,
        );
        const innerRadius = Math.max(0, attibuesOverride.innerRadius ?? baseInnerRadius);

        const outerRadius = Math.max(
          0,
          attibuesOverride.outerRadius ?? baseOuterRadius + attibuesOverride.additionalRadius,
        );
        const cornerRadius = attibuesOverride.cornerRadius ?? baseCornerRadius;

        return {
          ...item,
          ...attibuesOverride,
          isFaded,
          isHighlighted,
          paddingAngle,
          innerRadius,
          outerRadius,
          cornerRadius,
        };
      }),
    [
      baseCornerRadius,
      baseInnerRadius,
      baseOuterRadius,
      basePaddingAngle,
      data,
      faded,
      getHighlightStatus,
      highlighted,
    ],
  );

  return dataWithHighlight;
}
