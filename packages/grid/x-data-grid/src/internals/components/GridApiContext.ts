import * as React from 'react';

export const GridApiContext = React.createContext<unknown>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridApiContext.displayName = 'GridApiContext';
}
