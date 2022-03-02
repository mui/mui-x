import * as React from 'react';

export const GridApiContext = React.createContext<{
  internalApiRef: unknown;
  publicApiRef: unknown;
}>({ internalApiRef: undefined, publicApiRef: undefined });

if (process.env.NODE_ENV !== 'production') {
  GridApiContext.displayName = 'GridApiContext';
}
