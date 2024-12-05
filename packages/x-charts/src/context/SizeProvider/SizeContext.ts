import * as React from 'react';

import { Initializable } from '../context.types';
import { SizeContextState } from './Size.types';

export const SizeContext = React.createContext<Initializable<SizeContextState>>({
  isInitialized: false,
  data: {
    hasIntrinsicSize: false,
    svgRef: { current: null as any },
    height: 0,
    width: 0,
  },
});

if (process.env.NODE_ENV !== 'production') {
  SizeContext.displayName = 'SizeContext';
}
