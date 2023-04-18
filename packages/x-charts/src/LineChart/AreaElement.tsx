import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { color as d3Color } from 'd3-color';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';

export interface AreaElementClasses {
  /** Styles applied to the root element. */
  root: string;
}
export interface AreaElementOwnerState {
  id: string;
  color: string;
  isNotHighlighted: boolean;
  isHighlighted: boolean;
  classes?: Partial<AreaElementClasses>;
}

export function getAreaElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiAreaElement', slot);
}

export const lineElementClasses: AreaElementClasses = generateUtilityClasses('MuiAreaElement', [
  'root',
]);

const useUtilityClasses = (ownerState: AreaElementOwnerState) => {
  const { classes, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`],
  };

  return composeClasses(slots, getAreaElementUtilityClass, classes);
};

const AreaElementPath = styled('path', {
  name: 'MuiAreaElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: AreaElementOwnerState }>(({ ownerState }) => ({
  stroke: 'none',
  fill: d3Color(ownerState.color)!.brighter(1).formatHex(),
  opacity: ownerState.isNotHighlighted ? 0.3 : 1,
}));

export type AreaElementProps = Omit<AreaElementOwnerState, 'isNotHighlighted' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'>;

export function AreaElement(props: AreaElementProps) {
  const { id, classes: innerClasses, color, ...other } = props;

  const getInteractionItemProps = useInteractionItemProps();

  const { item } = React.useContext(InteractionContext);
  const someSeriesIsHighlighted = item !== null;
  const isHighlighted = item !== null && item.type === 'line' && item.seriesId === id;

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isNotHighlighted: someSeriesIsHighlighted && !isHighlighted,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <AreaElementPath
      {...other}
      ownerState={ownerState}
      className={classes.root}
      {...getInteractionItemProps({ type: 'line', seriesId: id })}
    />
  );
}
