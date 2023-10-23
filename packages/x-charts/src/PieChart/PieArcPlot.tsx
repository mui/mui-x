import * as React from 'react';
import PieArc, { PieArcProps } from './PieArc';
import {
  DefaultizedPieSeriesType,
  DefaultizedPieValueType,
  PieItemIdentifier,
} from '../models/seriesType/pie';

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
    innerRadius,
    outerRadius,
    cornerRadius,
    id: seriesId,
    highlightScope,
    highlighted,
    faded,
    data,
    onClick,
    skipAnimation,
    ...other
  } = props;

  // const transition = useTransition(completedData, {
  //   keys: (bar) => `${bar.seriesId}-${bar.dataIndex}`,
  //   from: getOutStyle,
  //   leave: getOutStyle,
  //   enter: getInStyle,
  //   update: getInStyle,
  //   immediate: skipAnimation,
  // });

  if (data.length === 0) {
    return null;
  }

  const Arc = slots?.pieArc ?? PieArc;

  return (
    <g {...other}>
      {data.map((item, index) => {
        return (
          <Arc
            {...item}
            key={item.id}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cornerRadius={cornerRadius}
            id={seriesId}
            color={item.color}
            dataIndex={index}
            highlightScope={highlightScope}
            highlighted={highlighted}
            faded={faded}
            onClick={
              onClick &&
              ((event) => {
                onClick(event, { type: 'pie', seriesId, dataIndex: index }, item);
              })
            }
            {...slotProps?.pieArc}
          />
        );
      })}
    </g>
  );
}
