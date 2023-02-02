import * as React from 'react';

export type DataParameters = {
  data: unknown[];
  
}

export const ChartDataContext = React.createContext<unknown>({});

if (process.env.NODE_ENV !== 'production') {
  ChartDataContext.displayName = 'ChartDataContext';
}
