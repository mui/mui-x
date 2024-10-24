import * as React from 'react';

import { Initializable } from '../context.types';
import { CartesianContextState } from './Cartesian.types';

export const CartesianContext = React.createContext<Initializable<CartesianContextState>>({
  isInitialized: false,
  data: {
    xAxis: {},
    yAxis: {},
    xAxisIds: [],
    yAxisIds: [],
  },
});

if (process.env.NODE_ENV !== 'production') {
  CartesianContext.displayName = 'CartesianContext';
}
