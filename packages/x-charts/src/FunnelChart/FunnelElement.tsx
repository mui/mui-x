'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import { color as d3Color } from '@mui/x-charts-vendor/d3-color';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useItemHighlighted } from '../context';
import { FunnelItemIdentifier } from './funnel.types';
import { SeriesId } from '../models/seriesType/common';

export interface FunnelElementProps extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  classes?: any;
  slots?: any;
  slotProps?: any;

  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    funnelItemIdentifier: FunnelItemIdentifier,
  ) => void;
}

export const FunnelElementPath = styled('path', {
  name: 'MuiFunnelElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: any }>(({ ownerState }) => ({
  stroke: 'none',
  fill: ownerState.isHighlighted
    ? d3Color(ownerState.color)!.brighter(0.5).formatHex()
    : ownerState.color,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: (ownerState.isFaded && 0.3) || 1,
}));

function FunnelElement(props: FunnelElementProps) {
  const {
    seriesId,
    dataIndex,
    classes: innerClasses,
    color,
    slots,
    slotProps,
    style,
    onClick,
    ...other
  } = props;
  const getInteractionItemProps = useInteractionItemProps();
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId,
    dataIndex,
  });

  const ownerState = {
    seriesId,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };

  const funnelProps = useSlotProps({
    elementType: FunnelElementPath,
    externalSlotProps: slotProps?.funnel,
    externalForwardedProps: other,
    additionalProps: {
      ...getInteractionItemProps({ type: 'funnel', seriesId, dataIndex }),
      style,
      onClick,
      cursor: onClick ? 'pointer' : 'unset',
    },
    ownerState,
  });

  return <FunnelElementPath {...funnelProps} />;
}

FunnelElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
} as any;

export { FunnelElement };
