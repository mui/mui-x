import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';

import { animated } from '@react-spring/web';
import { useSlotProps } from '@mui/base';
import clsx from 'clsx';
import { InteractionContext } from '../../context/InteractionProvider';
import { getIsFaded, getIsHighlighted } from '../../hooks/useInteractionItemProps';
import { barLabelClasses, useUtilityClasses } from './barLabelClasses';
import { HighlighContext } from '../../context/HighlightProvider';
import { BarLabelFunction, BarLabelOwnerState, BarLabelRootProps } from './types';

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
    barLabel?: BarLabelFunction;
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
    height,
    width,
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
