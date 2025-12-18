import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { type SeriesId } from '@mui/x-charts/internals';
import { type HeatmapClasses, getHeatmapUtilityClass } from './heatmapClasses';

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
  color: string;
  isHighlighted?: boolean;
  isFaded?: boolean;
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

const useUtilityClasses = (ownerState: HeatmapItemOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted } = ownerState;
  const slots = {
    cell: ['cell', `series-${seriesId}`, isFaded && 'faded', isHighlighted && 'highlighted'],
  };
  return composeClasses(slots, getHeatmapUtilityClass, classes);
};

interface HeatmapCellProps extends React.SVGAttributes<SVGRectElement> {
  ownerState: {
    isHighlighted: boolean;
    isFaded: boolean;
    color: string;
  };
}

function HeatmapCell({ ownerState, ...props }: HeatmapCellProps) {
  const { isHighlighted, isFaded, color } = ownerState;

  let filter: React.CSSProperties['filter'] = undefined;

  if (isHighlighted) {
    filter = 'saturate(120%)';
  } else if (isFaded) {
    filter = 'saturate(80%)';
  }

  return <rect filter={filter} fill={color} shapeRendering="crispEdges" {...props} />;
}

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
    slotProps = {},
    slots = {},
    ...other
  } = props;

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
