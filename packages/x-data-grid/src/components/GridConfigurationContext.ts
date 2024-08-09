import * as React from 'react';

export const GridConfigurationContext = React.createContext<unknown>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridConfigurationContext.displayName = 'GridConfigurationContext';
}
