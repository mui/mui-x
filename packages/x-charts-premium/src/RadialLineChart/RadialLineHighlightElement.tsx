import * as React from 'react';
import reactMajor from '@mui/x-internals/reactMajor';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { type SeriesId } from '@mui/x-charts/models';
import { getSymbol } from '@mui/x-charts/internals';
import { useUtilityClasses } from './radialLineClasses';

interface RadialLineHighlightElementCommonProps {
  seriesId: SeriesId;
  color: string;
  x: number;
  y: number;
}

export type RadialLineHighlightElementProps =
  | (RadialLineHighlightElementCommonProps & { shape: 'circle' } & Omit<
        React.SVGProps<SVGCircleElement>,
        'ref'
      >)
  | (RadialLineHighlightElementCommonProps & {
      shape: 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    } & Omit<React.SVGProps<SVGPathElement>, 'ref'>);

function RadialLineHighlightElement(props: RadialLineHighlightElementProps) {
  const { x, y, seriesId, color, shape, ...other } = props;

  const classes = useUtilityClasses();

  const Element = shape === 'circle' ? 'circle' : 'path';

  const additionalProps =
    shape === 'circle'
      ? { cx: 0, cy: 0, r: other.r === undefined ? 5 : other.r }
      : {
          d: d3Symbol(d3SymbolsFill[getSymbol(shape)])()!,
        };

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

export { RadialLineHighlightElement };
