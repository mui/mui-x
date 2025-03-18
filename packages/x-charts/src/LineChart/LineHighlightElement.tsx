'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import reactMajor from '@mui/x-internals/reactMajor';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { SeriesId } from '../models/seriesType/common';
import { getSymbol } from '../internals/getSymbol';

export interface LineHighlightElementClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type HighlightElementClassKey = keyof LineHighlightElementClasses;

interface LineHighlightElementCommonProps {
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

const useUtilityClasses = (ownerState: Pick<LineHighlightElementCommonProps, 'classes' | 'id'>) => {
  const { classes, id } = ownerState;
  const slots = {
    root: ['root', `series-${id}`],
  };

  return composeClasses(slots, getHighlightElementUtilityClass, classes);
};

export type LineHighlightElementProps =
  | (LineHighlightElementCommonProps &
      ({ shape: 'circle' } & Omit<React.SVGProps<SVGCircleElement>, 'ref' | 'id'>))
  | (LineHighlightElementCommonProps & {
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

  const classes = useUtilityClasses(props);

  const Element = shape === 'circle' ? 'circle' : 'path';

  const additionalProps =
    shape === 'circle'
      ? { cx: 0, cy: 0, r: other.r === undefined ? 5 : other.r }
      : {
          d: d3Symbol(d3SymbolsFill[getSymbol(shape)])()!,
        };

  // React 18 does not recognize `transformOrigin` and React 19 does not recognize `transform-origin`
  const transformOrigin =
    reactMajor > 18 ? { transformOrigin: `${x} ${y}` } : { 'transform-origin': `${x} ${y}` };

  return (
    <Element
      pointerEvents="none"
      className={classes.root}
      transform={`translate(${x} ${y})`}
      fill={color}
      {...transformOrigin}
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
