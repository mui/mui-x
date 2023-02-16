import * as React from 'react';

export const SeriesContext = React.createContext<any[]>([]);

if (process.env.NODE_ENV !== 'production') {
  SeriesContext.displayName = 'SeriesContext';
}
