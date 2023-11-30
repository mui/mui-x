import * as React from 'react';
import { useTransition } from '@react-spring/web';
import { PieArc, PieArcProps } from './PieArc';
import {
  DefaultizedPieSeriesType,
  DefaultizedPieValueType,
  PieItemIdentifier,
} from '../models/seriesType/pie';
import { defaultTransitionConfig } from './dataTransform/transition';
import {
  AnimatedObject,
  ValueWithHighlight,
  useTransformData,
} from './dataTransform/useTransformData';
import { DefaultizedProps } from '../models/helpers';

export interface PieArcPlotSlots {
  pieArc?: React.JSXElementConstructor<PieArcProps>;
}

export interface PieArcPlotSlotProps {
  pieArc?: Partial<PieArcProps>;
}

export interface PieArcPlotProps
  extends DefaultizedProps<
    Pick<
      DefaultizedPieSeriesType,
      | 'data'
      | 'faded'
      | 'highlighted'
      | 'innerRadius'
      | 'outerRadius'
      | 'cornerRadius'
      | 'paddingAngle'
      | 'id'
      | 'highlightScope'
    >,
    'outerRadius'
  > {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: PieArcPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PieArcPlotSlotProps;
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
    innerRadius = 0,
    outerRadius,
    cornerRadius = 0,
    paddingAngle = 0,
    id,
    highlightScope,
    highlighted,
    faded = { additionalRadius: -5 },
    data,
    onClick,
    skipAnimation,
    ...other
  } = props;

  const transformedData = useTransformData({
    innerRadius,
    outerRadius,
    cornerRadius,
    paddingAngle,
    id,
    highlightScope,
    highlighted,
    faded,
    data,
  });
  const transition = useTransition<ValueWithHighlight, AnimatedObject>(transformedData, {
    ...defaultTransitionConfig,
    immediate: skipAnimation,
  });

  if (data.length === 0) {
    return null;
  }

  const Arc = slots?.pieArc ?? PieArc;

  return (
    <g {...other}>
      {transition(
        (
          {
            startAngle,
            endAngle,
            paddingAngle: pA,
            innerRadius: iR,
            outerRadius: oR,
            cornerRadius: cR,
            ...style
          },
          item,
          _,
          index,
        ) => {
          return (
            <Arc
              startAngle={startAngle}
              endAngle={endAngle}
              paddingAngle={pA}
              innerRadius={iR}
              outerRadius={oR}
              cornerRadius={cR}
              style={style}
              id={id}
              color={item.color}
              dataIndex={index}
              highlightScope={highlightScope}
              isFaded={item.isFaded}
              isHighlighted={item.isHighlighted}
              onClick={
                onClick &&
                ((event) => {
                  onClick(event, { type: 'pie', seriesId: id, dataIndex: index }, item);
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
