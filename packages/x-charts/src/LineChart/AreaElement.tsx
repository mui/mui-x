import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { color as d3Color } from 'd3-color';

export interface AreaElementClasses {
  /** Styles applied to the root element. */
  root: string;
}
export interface AreaElementOwnerState {
  id: string;
  color: string;
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
  pointerEvents: 'none',
}));

export type AreaElementProps = AreaElementOwnerState & React.ComponentPropsWithoutRef<'path'>;

export function AreaElement(props: AreaElementProps) {
  const { id, classes: innerClasses, color, ...other } = props;
  const ownerState = { id, classes: innerClasses, color };
  const classes = useUtilityClasses(ownerState);

  return <AreaElementPath {...other} ownerState={ownerState} className={classes.root} />;
}
