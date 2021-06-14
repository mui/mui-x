import * as React from 'react';
import { GridApiRef } from '../models/api/gridApiRef';

export const GridApiContext = React.createContext<GridApiRef | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridApiContext.displayName = 'GridApiContext';
}
