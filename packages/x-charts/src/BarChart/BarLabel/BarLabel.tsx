import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';

import { animated } from '@react-spring/web';
import { useSlotProps } from '@mui/base';
import clsx from 'clsx';
import { SeriesId } from '../../models/seriesType/common';
import { InteractionContext } from '../../context/InteractionProvider';
import { getIsFaded, getIsHighlighted } from '../../hooks/useInteractionItemProps';
import type { BarItem, BarLabelContext } from '../types';
import { BarLabelClasses, barLabelClasses, getBarLabelUtilityClass } from './barLabelClasses';
import { HighlighContext } from '../../context/HighlightProvider';

export interface BarLabelOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarLabelClasses>;
}

const composeUtilityClasses = (ownerState: BarLabelOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${seriesId}`],
    highlighted: [isHighlighted && 'highlighted'],
    faded: [isFaded && 'faded'],
  };

  return composeClasses(slots, getBarLabelUtilityClass, classes);
};

export const BarLabelRoot = styled(animated.text, {
  name: 'MuiBarLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    { [`&.${barLabelClasses.faded}`]: styles.faded },
    { [`&.${barLabelClasses.highlighted}`]: styles.highlighted },
    styles.root,
  ],
})(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
  opacity: 1,

  [`&.${barLabelClasses.faded}`]: {
    opacity: 0.3,
  },
}));

export type BarLabelRootProps = Omit<React.ComponentPropsWithoutRef<'text'>, 'id'> & {
  ownerState: BarLabelOwnerState;
};

export interface BarLabelSlots {
  /**
   * The component that renders the bar label.
   * @default BarLabelRoot
   */
  barLabel?: React.JSXElementConstructor<BarLabelRootProps>;
}

export interface BarLabelSlotProps {
  barLabel?: Partial<BarLabelRootProps>;
}

export type BarLabelProps = Omit<BarLabelOwnerState, 'isFaded' | 'isHighlighted'> &
  Pick<BarLabelRootProps, 'style'> & {
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: BarLabelSlotProps;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: BarLabelSlots;
    height: number;
    width: number;
    layout?: 'vertical' | 'horizontal';
    value: number | null;
    barLabel?: (item: BarItem, context: BarLabelContext) => string | null;
  };

function BarLabel(props: BarLabelProps) {
  const {
    seriesId,
    classes: innerClasses,
    color,
    style,
    dataIndex,
    barLabel,
    slots,
    slotProps,
    height,
    width,
    value,
    ...other
  } = props;
  const { item } = React.useContext(InteractionContext);
  const { scope } = React.useContext(HighlighContext);

  const isHighlighted = getIsHighlighted(item, { type: 'bar', seriesId, dataIndex }, scope);
  const isFaded = !isHighlighted && getIsFaded(item, { type: 'bar', seriesId, dataIndex }, scope);

  const ownerState = {
    seriesId,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    dataIndex,
  };
  const classes = composeUtilityClasses(ownerState);

  const Component = slots?.barLabel ?? BarLabelRoot;

  const barLabelProps = useSlotProps({
    elementType: Component,
    externalSlotProps: slotProps?.barLabel,
    additionalProps: {
      ...other,
      style,
      className: clsx(classes.root, classes.highlighted, classes.faded),
    },
    ownerState,
  });

  if (!barLabel) {
    return null;
  }

  const formattedLabelText = barLabel(
    {
      seriesId,
      dataIndex,
      value,
    },
    {
      bar: {
        height,
        width,
      },
    },
  );

  if (!formattedLabelText) {
    return null;
  }

  return <Component {...barLabelProps}>{formattedLabelText}</Component>;
}

BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
} as any;

export { BarLabel };
