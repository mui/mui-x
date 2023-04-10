import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface LineElementClasses {
  /** Styles applied to the root element. */
  root: string;
}
export interface LineElementOwnerState {
  id: string;
  color: string;
  classes?: Partial<LineElementClasses>;
}

export function getLineElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiLineElement', slot);
}

export const lineElementClasses: LineElementClasses = generateUtilityClasses('MuiLineElement', [
  'root',
]);

const useUtilityClasses = (ownerState: LineElementOwnerState) => {
  const { classes, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`],
  };

  return composeClasses(slots, getLineElementUtilityClass, classes);
};

const LineElementPath = styled('path', {
  name: 'MuiLineElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: LineElementOwnerState }>(({ ownerState }) => ({
  stroke: ownerState.color,
  strokeWidth: 5,
  fill: 'none',
  pointerEvents: 'none',
}));

export type LineElementProps = LineElementOwnerState & React.ComponentPropsWithoutRef<'path'>;

export function LineElement(props: LineElementProps) {
  const { id, classes: innerClasses, color, ...other } = props;
  const ownerState = { id, classes: innerClasses, color };
  const classes = useUtilityClasses(ownerState);

  return <LineElementPath {...other} ownerState={ownerState} className={classes.root} />;
}
