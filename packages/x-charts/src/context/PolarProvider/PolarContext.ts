import * as React from 'react';

import { Initializable } from '../context.types';
import { PolarContextState } from './Polar.types';

export const PolarContext = React.createContext<Initializable<PolarContextState>>({
  isInitialized: false,
  data: {
    rotationAxis: {},
    radiusAxis: {},
    rotationAxisIds: [],
    radiusAxisIds: [],
  },
});

if (process.env.NODE_ENV !== 'production') {
  PolarContext.displayName = 'PolarContext';
}
