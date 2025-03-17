'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { SeriesId } from '../models/seriesType/common';
import { getSymbol } from '../internals/getSymbol';

export interface LineHighlightElementClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type HighlightElementClassKey = keyof LineHighlightElementClasses;

interface LineHighlightElementOwnerState {
  id: SeriesId;
  color: string;
  x: number;
  y: number;
  classes?: Partial<LineHighlightElementClasses>;
}

export function getHighlightElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiHighlightElement', slot);
}

export const lineHighlightElementClasses: LineHighlightElementClasses = generateUtilityClasses(
  'MuiHighlightElement',
  ['root'],
);

const useUtilityClasses = (ownerState: LineHighlightElementOwnerState) => {
  const { classes, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`],
  };

  return composeClasses(slots, getHighlightElementUtilityClass, classes);
};

const HighlightPathElement = styled('path', {
  name: 'MuiHighlightElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: LineHighlightElementOwnerState }>();

const HighlightCircleElement = styled('circle', {
  name: 'MuiHighlightElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: LineHighlightElementOwnerState }>();

export type LineHighlightElementProps =
  | (LineHighlightElementOwnerState &
      ({ shape: 'circle' } & Omit<React.SVGProps<SVGCircleElement>, 'ref' | 'id'>))
  | (LineHighlightElementOwnerState & {
      shape: 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    } & Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'>);

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightElement API](https://mui.com/x/api/charts/line-highlight-element/)
 */
function LineHighlightElement(props: LineHighlightElementProps) {
  const { x, y, id, classes: innerClasses, color, shape, ...other } = props;

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    x,
    y,
  };
  const classes = useUtilityClasses(ownerState);

  const Element = shape === 'circle' ? HighlightCircleElement : HighlightPathElement;

  const additionalProps =
    shape === 'circle'
      ? { cx: 0, cy: 0, r: other.r === undefined ? 5 : other.r }
      : {
          d: d3Symbol(d3SymbolsFill[getSymbol(shape)])()!,
        };
  return (
    <Element
      pointerEvents="none"
      ownerState={ownerState}
      className={classes.root}
      transform={`translate(${x}, ${y})`}
      transform-origin={`${x}px ${y}px`}
      fill={color}
      {...additionalProps}
      {...other}
    />
  );
}

LineHighlightElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
} as any;

export { LineHighlightElement };
