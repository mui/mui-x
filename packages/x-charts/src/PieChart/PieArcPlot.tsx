import * as React from 'react';
import PropTypes from 'prop-types';
import { useTransition } from '@react-spring/web';
import { PieArc, PieArcProps } from './PieArc';
import {
  ComputedPieRadius,
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
import { useHighlighted } from '../context';

export interface PieArcPlotSlots {
  pieArc?: React.JSXElementConstructor<PieArcProps>;
}

export interface PieArcPlotSlotProps {
  pieArc?: Partial<PieArcProps>;
}

export interface PieArcPlotProps
  extends Pick<
      DefaultizedPieSeriesType,
      'data' | 'faded' | 'highlighted' | 'cornerRadius' | 'paddingAngle' | 'id'
    >,
    ComputedPieRadius {
  /**
   * Override the arc attributes when it is faded.
   * @default { additionalRadius: -5 }
   */
  faded?: DefaultizedPieSeriesType['faded'];
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
  onItemClick?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    pieItemIdentifier: PieItemIdentifier,
    item: DefaultizedPieValueType,
  ) => void;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
}

function PieArcPlot(props: PieArcPlotProps) {
  const {
    slots,
    slotProps,
    innerRadius = 0,
    outerRadius,
    cornerRadius = 0,
    paddingAngle = 0,
    id,
    highlighted,
    faded = { additionalRadius: -5 },
    data,
    onItemClick,
    skipAnimation,
    ...other
  } = props;

  const transformedData = useTransformData({
    innerRadius,
    outerRadius,
    cornerRadius,
    paddingAngle,
    id,
    highlighted,
    faded,
    data,
  });
  const transition = useTransition<ValueWithHighlight, AnimatedObject>(transformedData, {
    ...defaultTransitionConfig,
    immediate: skipAnimation,
  });
  const { highlightScope } = useHighlighted();

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
            arcLabelRadius,
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
                onItemClick &&
                ((event) => {
                  onItemClick(event, { type: 'pie', seriesId: id, dataIndex: index }, item);
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

PieArcPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The radius between circle center and the arc label in px.
   * @default (innerRadius - outerRadius) / 2
   */
  arcLabelRadius: PropTypes.number,
  /**
   * The radius applied to arc corners (similar to border radius).
   * @default 0
   */
  cornerRadius: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      endAngle: PropTypes.number.isRequired,
      formattedValue: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      index: PropTypes.number.isRequired,
      label: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      padAngle: PropTypes.number.isRequired,
      startAngle: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  /**
   * Override the arc attributes when it is faded.
   * @default { additionalRadius: -5 }
   */
  faded: PropTypes.shape({
    additionalRadius: PropTypes.number,
    arcLabelRadius: PropTypes.number,
    color: PropTypes.string,
    cornerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    paddingAngle: PropTypes.number,
  }),
  /**
   * Override the arc attributes when it is highlighted.
   */
  highlighted: PropTypes.shape({
    additionalRadius: PropTypes.number,
    arcLabelRadius: PropTypes.number,
    color: PropTypes.string,
    cornerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    paddingAngle: PropTypes.number,
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The radius between circle center and the beginning of the arc.
   * @default 0
   */
  innerRadius: PropTypes.number,
  /**
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onItemClick: PropTypes.func,
  /**
   * The radius between circle center and the end of the arc.
   */
  outerRadius: PropTypes.number.isRequired,
  /**
   * The padding angle (deg) between two arcs.
   * @default 0
   */
  paddingAngle: PropTypes.number,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { PieArcPlot };
