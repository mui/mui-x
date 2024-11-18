'use client';
import * as React from 'react';
import { Initializable } from '../context.types';
import { SvgRefState } from './SvgRef.types';

export const SvgRefContext = React.createContext<Initializable<SvgRefState>>({
  isInitialized: false,
  data: {
    svgRef: { current: null },
    surfaceRef: { current: null },
  },
});

if (process.env.NODE_ENV !== 'production') {
  SvgRefContext.displayName = 'SvgRefContext';
}
