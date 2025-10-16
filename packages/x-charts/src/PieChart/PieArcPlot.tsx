'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { PieArc, PieArcProps, pieArcClasses } from './PieArc';
import {
  ComputedPieRadius,
  DefaultizedPieSeriesType,
  DefaultizedPieValueType,
  PieItemIdentifier,
} from '../models/seriesType/pie';
import { useTransformData } from './dataTransform/useTransformData';

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

  const theme = useTheme();

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

  const { dataIndex: focusedIndex = -1 } = useFocusedItem() ?? {};
  const focusedItem = focusedIndex !== -1 ? transformedData[focusedIndex] : null;

  if (data.length === 0) {
    return null;
  }

  const Arc = slots?.pieArc ?? PieArc;

  return (
    <g {...other}>
      {transformedData.map((item, index) => (
        <Arc
          key={item.dataIndex}
          startAngle={item.startAngle}
          endAngle={item.endAngle}
          paddingAngle={item.paddingAngle}
          innerRadius={item.innerRadius}
          outerRadius={item.outerRadius}
          cornerRadius={item.cornerRadius}
          skipAnimation={skipAnimation ?? false}
          id={id}
          color={item.color}
          dataIndex={index}
          isFaded={item.isFaded}
          isHighlighted={item.isHighlighted}
          isFocused={item.isFocused}
          onClick={
            onItemClick &&
            ((event) => {
              onItemClick(event, { type: 'pie', seriesId: id, dataIndex: index }, item);
            })
          }
          {...slotProps?.pieArc}
        />
      ))}
      {/* Render the focus indicator last, so it can align nicely over all arcs */}
      {focusedItem && (
        <Arc
          startAngle={focusedItem.startAngle}
          endAngle={focusedItem.endAngle}
          paddingAngle={focusedItem.paddingAngle}
          innerRadius={focusedItem.innerRadius}
          color="transparent"
          pointerEvents="none"
          skipInteraction
          outerRadius={focusedItem.outerRadius}
          cornerRadius={focusedItem.cornerRadius}
          skipAnimation
          stroke={(theme.vars ?? theme).palette.text.primary}
          id={id}
          className={pieArcClasses.focusIndicator}
          dataIndex={focusedIndex}
          isFaded={false}
          isHighlighted={false}
          isFocused={false}
          strokeWidth={3}
        />
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
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      index: PropTypes.number.isRequired,
      label: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      labelMarkType: PropTypes.oneOfType([
        PropTypes.oneOf(['circle', 'line', 'square']),
        PropTypes.func,
      ]),
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
  /**
   * The id of this series.
   */
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
