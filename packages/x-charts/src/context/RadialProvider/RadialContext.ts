import * as React from 'react';

import { Initializable } from '../context.types';
import { RadialContextState } from './Radial.types';

export const RadialContext = React.createContext<Initializable<RadialContextState>>({
  isInitialized: false,
  data: {
    rotationAxis: {},
    radiusAxis: {},
    rotationAxisIds: [],
    radiusAxisIds: [],
  },
});

if (process.env.NODE_ENV !== 'production') {
  RadialContext.displayName = 'RadialContext';
}
