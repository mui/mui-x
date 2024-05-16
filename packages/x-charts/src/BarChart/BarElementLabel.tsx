import * as React from 'react';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';

import { animated } from '@react-spring/web';
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
  id: SeriesId;
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

const useUtilityClasses = (ownerState: BarElementLabelOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getBarElementLabelUtilityClass, classes);
};

export const BarElementLabelRoot = styled(animated.text, {
  name: 'MuiBarElementLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: BarElementLabelOwnerState }>(({ ownerState, theme }) => ({
  stroke: 'none',
  fill: (theme.vars || theme).palette.text.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: (ownerState.isFaded && 0.3) || 1,
  textAnchor: 'middle',
  textAlign: 'center',
  dominantBaseline: 'middle',
  pointerEvents: 'none',
}));

export type BarElementLabelProps = Pick<
  BarElementLabelOwnerState,
  'id' | 'classes' | 'dataIndex' | 'color'
> &
  Omit<React.ComponentPropsWithoutRef<'text'>, 'id'> & {
    labelText: string | null;
    highlightScope?: Partial<HighlightScope>;
  };

function BarElementLabel(props: BarElementLabelProps) {
  const {
    id,
    classes: innerClasses,
    color,
    style,
    dataIndex,
    highlightScope,
    labelText,
    ...other
  } = props;
  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(
    item,
    { type: 'bar', seriesId: id, dataIndex },
    highlightScope,
  );
  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'bar', seriesId: id, dataIndex }, highlightScope);

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    dataIndex,
  };
  const classes = useUtilityClasses(ownerState);

  if (!labelText) {
    return null;
  }

  return (
    <BarElementLabelRoot className={classes.root} {...other} style={style} ownerState={ownerState}>
      {labelText}
    </BarElementLabelRoot>
  );
}

BarElementLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
} as any;

export { BarElementLabel };
