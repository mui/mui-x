import * as React from 'react';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';

import { animated } from '@react-spring/web';
import { useSlotProps } from '@mui/base';
import { SeriesId } from '../models/seriesType/common';
import { InteractionContext } from '../context/InteractionProvider';
import { getIsFaded, getIsHighlighted } from '../hooks/useInteractionItemProps';
import { HighlightScope } from '../context';

export interface BarElementLabelClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type BarElementLabelClassKey = keyof BarElementLabelClasses;

export interface BarElementLabelOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarElementLabelClasses>;
}

export function getBarElementLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarElementLabel', slot);
}

export const barElementClasses: BarElementLabelClasses = generateUtilityClasses(
  'MuiBarElementLabel',
  ['root', 'highlighted', 'faded'],
);

const composeUtilityClasses = (ownerState: BarElementLabelOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${seriesId}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getBarElementLabelUtilityClass, classes);
};

export const BarElementLabelRoot = styled(animated.text, {
  name: 'MuiBarElementLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: BarElementLabelOwnerState }>(({ ownerState, theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: (ownerState.isFaded && 0.3) || 1,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
}));

export type BarLabelProps = Omit<React.ComponentPropsWithoutRef<'text'>, 'id'> & {
  ownerState: BarElementLabelOwnerState;
  minWidth?: number;
  minHeight?: number;
};

export interface BarElementLabelSlots {
  /**
   * The component that renders the bar label.
   * @default BarElementLabelRoot
   */
  barLabel?: React.JSXElementConstructor<BarLabelProps>;
}

export interface BarElementLabelSlotProps {
  barLabel?: Partial<BarLabelProps>;
}

export type BarElementLabelProps = Omit<BarElementLabelOwnerState, 'isFaded' | 'isHighlighted'> &
  Pick<BarLabelProps, 'style' | 'minWidth' | 'minHeight'> & {
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: BarElementLabelSlotProps;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: BarElementLabelSlots;
    labelText: string | null;
    highlightScope?: Partial<HighlightScope>;
    height?: number;
    width?: number;
    layout?: 'vertical' | 'horizontal';
  };

function BarElementLabel(props: BarElementLabelProps) {
  const {
    seriesId,
    classes: innerClasses,
    color,
    style,
    dataIndex,
    highlightScope,
    labelText,
    slots,
    slotProps,
    minHeight,
    minWidth,
    height,
    width,
    ...other
  } = props;
  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(
    item,
    { type: 'bar', seriesId, dataIndex },
    highlightScope,
  );
  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'bar', seriesId, dataIndex }, highlightScope);

  const ownerState = {
    seriesId,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    dataIndex,
  };
  const classes = composeUtilityClasses(ownerState);

  const Component = slots?.barLabel ?? BarElementLabelRoot;

  const barLabelProps = useSlotProps({
    elementType: Component,
    externalSlotProps: slotProps?.barLabel,
    additionalProps: {
      ...other,
      style,
      className: classes.root,
    },
    ownerState,
  });

  if (!labelText || (height ?? 0) < (minHeight ?? 0) || (width ?? 0) < (minWidth ?? 0)) {
    return null;
  }

  return <Component {...barLabelProps}>{labelText}</Component>;
}

BarElementLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
} as any;

export { BarElementLabel };
