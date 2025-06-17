import * as React from 'react';
import type { ChartContextValue } from './ChartProvider.types';

/**
 * @ignore - internal component.
 */
export const ChartContext = React.createContext<ChartContextValue<any> | null>(null);
