import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { color as d3Color } from 'd3-color';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from 'd3-shape';
import { getSymbol } from '../internals/utils';

export interface MarkElementClasses {
  /** Styles applied to the root element. */
  root: string;
}
export interface MarkElementOwnerState {
  id: string;
  color: string;
  classes?: Partial<MarkElementClasses>;
}

export function getMarkElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiMarkElement', slot);
}

export const lineElementClasses: MarkElementClasses = generateUtilityClasses('MuiMarkElement', [
  'root',
]);

const useUtilityClasses = (ownerState: MarkElementOwnerState) => {
  const { classes, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`],
  };

  return composeClasses(slots, getMarkElementUtilityClass, classes);
};

const MarkElementPath = styled('path', {
  name: 'MuiMarkElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MarkElementOwnerState }>(({ ownerState }) => ({
  stroke: 'none',
  fill: d3Color(ownerState.color)!.brighter(1).formatHex(),
  pointerEvents: 'none',
}));

export type MarkElementProps = MarkElementOwnerState &
  React.ComponentPropsWithoutRef<'path'> & {
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
  };

export function MarkElement(props: MarkElementProps) {
  const { id, classes: innerClasses, color, shape, ...other } = props;
  const ownerState = { id, classes: innerClasses, color };
  const classes = useUtilityClasses(ownerState);

  return (
    <MarkElementPath
      {...other}
      ownerState={ownerState}
      className={classes.root}
      d={d3Symbol(d3SymbolsFill[getSymbol(shape)])()!}
    />
  );
}
