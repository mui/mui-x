import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { color as d3Color } from 'd3-color';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from 'd3-shape';
import { getSymbol } from '../internals/utils';
import { InteractionContext } from '../context/InteractionProvider';

export interface MarkElementClasses {
  /** Styles applied to the root element. */
  root: string;
}
export interface MarkElementOwnerState {
  id: string;
  color: string;
  isNotHighlighted: boolean;
  isHighlighted: boolean;
  x: number;
  y: number;
  classes?: Partial<MarkElementClasses>;
}

export function getMarkElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiMarkElement', slot);
}

export const lineElementClasses: MarkElementClasses = generateUtilityClasses('MuiMarkElement', [
  'root',
]);

const useUtilityClasses = (ownerState: MarkElementOwnerState) => {
  const { classes, isHighlighted, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'isHighlighted'],
  };

  return composeClasses(slots, getMarkElementUtilityClass, classes);
};

const MarkElementPath = styled('path', {
  name: 'MuiMarkElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MarkElementOwnerState }>(({ ownerState }) => ({
  transform: `translate(${ownerState.x}px, ${ownerState.y}px) ${
    ownerState.isHighlighted ? 'scale(2)' : ''
  }`,
  fill: d3Color(ownerState.color)!.brighter(1).formatHex(),
  stroke: ownerState.color,
  strokeWidth: ownerState.isHighlighted ? 2 : 1,
  pointerEvents: 'none',
}));

export type MarkElementProps = Omit<MarkElementOwnerState, 'isNotHighlighted' | 'isHighlighted'> &
  React.ComponentPropsWithoutRef<'path'> & {
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
  };

export function MarkElement(props: MarkElementProps) {
  const { x, y, id, classes: innerClasses, color, shape, dataIndex, ...other } = props;
  const { axis } = React.useContext(InteractionContext);
  const isHighlighted = axis.x?.index === dataIndex;
  const someSeriesIsHighlighted = axis.x !== null;
  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted,
    isNotHighlighted: someSeriesIsHighlighted && !isHighlighted,
    color,
    x,
    y,
  };
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
