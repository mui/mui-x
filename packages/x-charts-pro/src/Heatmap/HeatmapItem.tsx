import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { useItemHighlighted } from '@mui/x-charts/context';
import { useInteractionItemProps, SeriesId } from '@mui/x-charts/internals';
import { HeatmapClasses, getHeatmapUtilityClass } from './heatmapClasses';

export interface HeatmapItemSlots {
  /**
   * The component that renders the heatmap cell.
   * @default HeatmapCell
   */
  cell?: React.ElementType;
}

export interface HeatmapItemSlotProps {
  cell?: Partial<React.ComponentPropsWithRef<'rect'>>;
}

export interface HeatmapItemProps {
  dataIndex: number;
  seriesId: SeriesId;
  value: number;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
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

export interface HeatmapItemOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<HeatmapClasses>;
}

const HeatmapCell = styled('rect', {
  name: 'MuiHeatmap',
  slot: 'Cell',
  overridesResolver: (_, styles) => styles.arc,
})<{ ownerState: HeatmapItemOwnerState }>(({ ownerState }) => ({
  filter:
    (ownerState.isHighlighted && 'saturate(120%)') ||
    (ownerState.isFaded && 'saturate(80%)') ||
    undefined,
  fill: ownerState.color,
  shapeRendering: 'crispEdges',
}));

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
  const { seriesId, dataIndex, color, value, slotProps = {}, slots = {}, ...other } = props;

  const getInteractionItemProps = useInteractionItemProps();
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId,
    dataIndex,
  });

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
    additionalProps: { ...getInteractionItemProps({ type: 'heatmap', seriesId, dataIndex }) },
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
