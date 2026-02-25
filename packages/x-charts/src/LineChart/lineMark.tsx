import * as React from 'react';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { getSymbol, type SymbolsTypes } from '../internals/getSymbol';
import type { ChartsLabelCustomMarkProps } from '../ChartsLabel/ChartsLabelMark';

const SYMBOL_SIZE = 100;

function createLineMarkComponent(shape: SymbolsTypes) {
  const path = d3Symbol(d3SymbolsFill[getSymbol(shape)]).size(SYMBOL_SIZE)()!;

  function LineMark({ className, color }: ChartsLabelCustomMarkProps) {
    return (
      <svg viewBox="-7 -7 14 14">
        <path className={className} d={path} fill={color} />
      </svg>
    );
  }

  LineMark.displayName = `LineMark${shape.charAt(0).toUpperCase()}${shape.slice(1)}`;
  return LineMark;
}

export const lineMarkComponents: Record<
  SymbolsTypes,
  React.ComponentType<ChartsLabelCustomMarkProps>
> = {
  circle: createLineMarkComponent('circle'),
  cross: createLineMarkComponent('cross'),
  diamond: createLineMarkComponent('diamond'),
  square: createLineMarkComponent('square'),
  star: createLineMarkComponent('star'),
  triangle: createLineMarkComponent('triangle'),
  wye: createLineMarkComponent('wye'),
};
