'use client';
import * as React from 'react';
import { useCharts } from '../internals/useCharts';
import { ChartStore } from '../internals/plugins/utils/ChartStore';

export const ChartsContext = React.createContext<{ store: ChartStore } | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ChartsContext.displayName = 'ChartsContext';
}

function InteractionProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const { contextValue } = useCharts();
  return <ChartsContext.Provider value={contextValue}>{children}</ChartsContext.Provider>;
}

export { InteractionProvider };
