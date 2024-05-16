import * as React from 'react';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';

import { animated } from '@react-spring/web';
import { useSlotProps } from '@mui/base';
import { SeriesId } from '../../models/seriesType/common';
import { InteractionContext } from '../../context/InteractionProvider';
import { getIsFaded, getIsHighlighted } from '../../hooks/useInteractionItemProps';
import { HighlightScope } from '../../context';

export interface BarLabelClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type BarLabelClassKey = keyof BarLabelClasses;

export interface BarLabelOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarLabelClasses>;
}

export function getBarLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarLabel', slot);
}

export const barElementLabelClasses: BarLabelClasses = generateUtilityClasses('MuiBarLabel', [
  'root',
  'highlighted',
  'faded',
]);

const composeUtilityClasses = (ownerState: BarLabelOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${seriesId}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getBarLabelUtilityClass, classes);
};

export const BarLabelRoot = styled(animated.text, {
  name: 'MuiBarLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: BarLabelOwnerState }>(({ ownerState, theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: (ownerState.isFaded && 0.3) || 1,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
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
    highlightScope?: Partial<HighlightScope>;
    height?: number;
    width?: number;
    layout?: 'vertical' | 'horizontal';
    value: number | null;
    barLabel?: () => string;
  };

function BarLabel(props: BarLabelProps) {
  const {
    seriesId,
    classes: innerClasses,
    color,
    style,
    dataIndex,
    highlightScope,
    barLabel,
    slots,
    slotProps,
    height,
    width,
    value,
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

  const Component = slots?.barLabel ?? BarLabelRoot;

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
