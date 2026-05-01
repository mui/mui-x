'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import reactMajor from '@mui/x-internals/reactMajor';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { type SeriesId } from '../models/seriesType/common';
import { getSymbol } from '../internals/getSymbol';
import { useUtilityClasses as useLineUtilityClasses } from './lineClasses';

interface LineHighlightElementCommonProps {
  seriesId: SeriesId;
  color: string;
  x: number;
  y: number;
}

export type LineHighlightElementProps =
  | (LineHighlightElementCommonProps & { shape: 'circle' } & Omit<
        React.SVGProps<SVGCircleElement>,
        'ref'
      >)
  | (LineHighlightElementCommonProps & {
      shape: 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    } & Omit<React.SVGProps<SVGPathElement>, 'ref'>);

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
  const { x, y, seriesId, color, shape, ...other } = props;

  const classes = useLineUtilityClasses();

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
      className={classes.highlight}
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
  seriesId: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
} as any;

export { LineHighlightElement };
