import * as React from 'react';
import { ChartContextValue } from './ChartProvider.types';

/**
 * @ignore - internal component.
 */
export const ChartContext = React.createContext<ChartContextValue<any> | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ChartContext.displayName = 'ChartContext';
}
