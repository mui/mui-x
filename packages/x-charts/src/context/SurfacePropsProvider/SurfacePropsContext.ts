import * as React from 'react';

import { Initializable } from '../context.types';
import { SurfacePropsContextState } from './SurfaceProps.types';

export const SurfacePropsContext = React.createContext<Initializable<SurfacePropsContextState>>({
  isInitialized: false,
  data: {
    width: 0,
    height: 0,
  },
});

if (process.env.NODE_ENV !== 'production') {
  SurfacePropsContext.displayName = 'SurfacePropsContext';
}
