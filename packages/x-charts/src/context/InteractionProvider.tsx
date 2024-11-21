'use client';
import * as React from 'react';
import { useCharts } from '../internals/store/useCharts';
import { ChartContextValue } from './ChartProvider.types';

export const ChartsContext = React.createContext<ChartContextValue<any> | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ChartsContext.displayName = 'ChartsContext';
}

function ChartProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const { contextValue } = useCharts([], {});
  return <ChartsContext.Provider value={contextValue}>{children}</ChartsContext.Provider>;
}

export { ChartProvider };
