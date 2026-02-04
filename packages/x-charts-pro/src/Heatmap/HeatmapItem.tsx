import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { type SeriesId, useInteractionItemProps } from '@mui/x-charts/internals';
import { getHeatmapUtilityClass } from './heatmapClasses';
import { HeatmapCell, type HeatmapItemOwnerState } from './internals/HeatmapCell';
import { shouldRegisterPointerInteractionsGlobally } from './shouldRegisterPointerInteractionsGlobally';

export interface HeatmapItemSlots {
  /**
   * The component that renders the heatmap cell.
   * @default HeatmapCell
   */
  cell?: React.ElementType;
}

export interface HeatmapItemSlotProps {
  cell?: Partial<HeatmapCellProps>;
}

export interface HeatmapItemProps {
  dataIndex: number;
  seriesId: SeriesId;
  value: number;
  width: number;
  height: number;
  x: number;
  y: number;
  xIndex: number;
  yIndex: number;
  color: string;
  isHighlighted?: boolean;
  isFaded?: boolean;
  /**
   * The border radius of the heatmap cell in pixels.
   */
  borderRadius?: number;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: HeatmapItemSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: HeatmapItemSlots;
}

export interface HeatmapCellProps extends React.ComponentPropsWithRef<'rect'> {
  x: number;
  y: number;
  width: number;
  height: number;
  ownerState: HeatmapItemOwnerState;
}

const useUtilityClasses = (ownerState: HeatmapItemOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted } = ownerState;
  const slots = {
    cell: ['cell', `series-${seriesId}`, isFaded && 'faded', isHighlighted && 'highlighted'],
  };
  return composeClasses(slots, getHeatmapUtilityClass, classes);
};

/**
 * @ignore - internal component.
 */
function HeatmapItem(props: HeatmapItemProps) {
  const {
    seriesId,
    dataIndex,
    color,
    value,
    isHighlighted = false,
    isFaded = false,
    borderRadius,
    xIndex,
    yIndex,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  // If we aren't using the default cell, we skip adding interaction props because we have a more efficient way to
  // calculate them. To avoid breaking changes, we need to keep this behavior. We can remove this in v9.
  const skipInteractionItemProps = shouldRegisterPointerInteractionsGlobally(
    props.slots,
    props.slotProps,
  );
  const interactionProps = useInteractionItemProps(
    { type: 'heatmap', seriesId, dataIndex, xIndex, yIndex },
    skipInteractionItemProps,
  );

  const ownerState = {
    seriesId,
    dataIndex,
    color,
    value,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const Cell = slots?.cell ?? HeatmapCell;
  const cellProps = useSlotProps({
    elementType: Cell,
    additionalProps: { ...interactionProps, rx: borderRadius, ry: borderRadius },
    externalForwardedProps: { ...other },
    externalSlotProps: slotProps.cell,
    ownerState,
    className: classes.cell,
  });

  return <Cell {...cellProps} />;
}

HeatmapItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  dataIndex: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
  value: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { HeatmapItem };
