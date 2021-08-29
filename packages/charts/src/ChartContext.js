import * as React from 'react';

/**
 * @ignore - internal component.
 */
const ChartContext = React.createContext({});

if (process.env.NODE_ENV !== 'production') {
  ChartContext.displayName = 'ChartContext';
}

export default ChartContext;
