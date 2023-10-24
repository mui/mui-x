import * as React from 'react';
import { useTransition } from '@react-spring/web';
import PieArc, { PieArcProps } from './PieArc';
import {
  DefaultizedPieSeriesType,
  DefaultizedPieValueType,
  PieItemIdentifier,
} from '../models/seriesType/pie';
import { getIsFaded, getIsHighlighted } from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';

export interface PieArcPlotSlotsComponent {
  pieArc?: React.JSXElementConstructor<PieArcProps>;
}

export interface PieArcPlotSlotComponentProps {
  pieArc?: Partial<PieArcProps>;
}

export interface PieArcPlotProps
  extends Pick<
      PieArcProps,
      | 'innerRadius'
      | 'outerRadius'
      | 'cornerRadius'
      | 'id'
      | 'highlightScope'
      | 'highlighted'
      | 'faded'
    >,
    Pick<DefaultizedPieSeriesType, 'data'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PieArcPlotSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PieArcPlotSlotComponentProps;
  /**
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onClick?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    pieItemIdentifier: PieItemIdentifier,
    item: DefaultizedPieValueType,
  ) => void;
  /**
   * If `true`, animations are skiped.
   * @default false
   */
  skipAnimation?: boolean;
}

export function PieArcPlot(props: PieArcPlotProps) {
  const {
    slots,
    slotProps,
    innerRadius: baseInnerRadius = 0,
    outerRadius: baseOuterRadius,
    cornerRadius: baseCornerRadius = 0,
    id: seriesId,
    highlightScope,
    highlighted,
    faded = { additionalRadius: -5 },
    data,
    onClick,
    skipAnimation,
    ...other
  } = props;

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
        const innerRadius = Math.max(0, attibuesOverride.innerRadius ?? baseInnerRadius);

        const outerRadius = Math.max(
          0,
          attibuesOverride.outerRadius ?? baseOuterRadius + attibuesOverride.additionalRadius,
        );
        const cornerRadius = attibuesOverride.cornerRadius ?? baseCornerRadius;
        return {
          ...item,
          isFaded,
          isHighlighted,
          innerRadius,
          outerRadius,
          cornerRadius,
          ...attibuesOverride,
        };
      }),
    [
      baseCornerRadius,
      baseInnerRadius,
      baseOuterRadius,
      data,
      faded,
      getHighlightStatus,
      highlighted,
    ],
  );

  const transition = useTransition<ValueWithHighlight, AnimatedObject>(dataWithHighlight, {
    keys: (item) => {
      return item.id;
    },
    from: ({ innerRadius, outerRadius, cornerRadius, startAngle, endAngle, color, isFaded }) => ({
      innerRadius,
      outerRadius: (innerRadius + outerRadius) / 2,
      cornerRadius,
      startAngle: (startAngle + endAngle) / 2,
      endAngle: (startAngle + endAngle) / 2,
      fill: color,
      opacity: isFaded ? 0.3 : 1,
    }),
    leave: ({ innerRadius, cornerRadius, startAngle, endAngle }) => ({
      innerRadius,
      outerRadius: innerRadius,
      cornerRadius,
      startAngle: (startAngle + endAngle) / 2,
      endAngle: (startAngle + endAngle) / 2,
    }),
    enter: ({ innerRadius, outerRadius, cornerRadius, startAngle, endAngle }) => ({
      innerRadius,
      outerRadius,
      cornerRadius,
      startAngle,
      endAngle,
    }),
    update: ({ innerRadius, outerRadius, cornerRadius, startAngle, endAngle, color, isFaded }) => ({
      innerRadius,
      outerRadius,
      cornerRadius,
      startAngle,
      endAngle,
      fill: color,
      opacity: isFaded ? 0.3 : 1,
    }),
    immediate: skipAnimation,
    config: {
      tension: 120,
      friction: 14,
      clamp: true,
    },
  });

  if (data.length === 0) {
    return null;
  }

  const Arc = slots?.pieArc ?? PieArc;

  return (
    <g {...other}>
      {transition(
        (
          { startAngle, endAngle, innerRadius, outerRadius, cornerRadius, ...style },
          item,
          _,
          index,
        ) => {
        return (
          <Arc
              startAngle={startAngle}
              endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cornerRadius={cornerRadius}
              style={style}
            id={seriesId}
            color={item.color}
            dataIndex={index}
            highlightScope={highlightScope}
              isFaded={item.isFaded}
              isHighlighted={item.isHighlighted}
            onClick={
              onClick &&
              ((event) => {
                onClick(event, { type: 'pie', seriesId, dataIndex: index }, item);
              })
            }
            {...slotProps?.pieArc}
          />
        );
        },
      )}
    </g>
  );
}
