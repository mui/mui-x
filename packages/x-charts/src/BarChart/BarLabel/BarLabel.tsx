import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';

import { animated } from '@react-spring/web';
import { useSlotProps } from '@mui/base/utils';
import clsx from 'clsx';
import { InteractionContext } from '../../context/InteractionProvider';
import { getIsFaded, getIsHighlighted } from '../../hooks/useInteractionItemProps';
import { barLabelClasses, useUtilityClasses } from './barLabelClasses';
import { HighlighContext } from '../../context/HighlightProvider';
import { BarLabelOwnerState, BarLabelComponentProps } from './types';

export const BarLabelComponent = styled(animated.text, {
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

export interface BarLabelSlots {
  /**
   * The component that renders the bar label.
   * @default BarLabelComponent
   */
  barLabel?: React.JSXElementConstructor<BarLabelComponentProps>;
}

export interface BarLabelSlotProps {
  barLabel?: Partial<BarLabelComponentProps>;
}

export type BarLabelProps = Omit<BarLabelOwnerState, 'isFaded' | 'isHighlighted'> &
  Pick<BarLabelComponentProps, 'style'> & {
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
    value: number | null;
    barLabel: string | null;
  };

function BarLabel(props: BarLabelProps) {
  const themeProps = useThemeProps({ props, name: 'MuiBarLabel' });

  const {
    seriesId,
    classes: innerClasses,
    color,
    style,
    dataIndex,
    barLabel,
    slots,
    slotProps,
    value,
    ...other
  } = themeProps;
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
  const classes = useUtilityClasses(ownerState);

  const Component = slots?.barLabel ?? BarLabelComponent;

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

  return <Component {...barLabelProps}>{barLabel}</Component>;
}

BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
} as any;

export { BarLabel };
