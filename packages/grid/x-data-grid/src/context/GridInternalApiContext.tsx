import * as React from 'react';

const GridInternalApiContext = React.createContext<unknown>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridInternalApiContext.displayName = 'GridInternalApiContext';
}

export { GridInternalApiContext };
