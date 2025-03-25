'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { BarElementOwnerState, useUtilityClasses } from './barElementClasses';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useItemHighlighted } from '../hooks/useItemHighlighted';
import { AnimatedBarElement, BarProps } from './AnimatedBarElement';

export interface BarElementSlots {
  /**
   * The component that renders the bar.
   * @default BarElementPath
   */
  bar?: React.ElementType<BarProps>;
}
export interface BarElementSlotProps {
  bar?: SlotComponentPropsFromProps<BarProps, {}, BarElementOwnerState>;
}

export type BarElementProps = Omit<BarElementOwnerState, 'isFaded' | 'isHighlighted'> &
  Omit<React.SVGProps<SVGRectElement>, 'ref' | 'id'> & {
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: BarElementSlotProps;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: BarElementSlots;

    x: number;
    y: number;
    width: number;
    height: number;
    layout: 'horizontal' | 'vertical';
    skipAnimation: boolean;
  };

function BarElement(props: BarElementProps) {
  const {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    slots,
    slotProps,
    style,
    onClick,
    skipAnimation,
    layout,
    ...other
  } = props;
  const interactionProps = useInteractionItemProps({ type: 'bar', seriesId: id, dataIndex });
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId: id,
    dataIndex,
  });

  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };

  const classes = useUtilityClasses(ownerState);

  const Bar = slots?.bar ?? AnimatedBarElement;

  const barProps = useSlotProps({
    elementType: Bar,
    externalSlotProps: slotProps?.bar,
    externalForwardedProps: other,
    additionalProps: {
      ...interactionProps,
      style,
      onClick,
      cursor: onClick ? 'pointer' : 'unset',
      stroke: 'none',
      fill: color,
      skipAnimation,
      layout,
    },
    className: classes.root,
    ownerState,
  });

  return <Bar {...barProps} />;
}

BarElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  skipAnimation: PropTypes.bool.isRequired,
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

export { BarElement };
