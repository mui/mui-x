'use client';
import * as React from 'react';
import { ChartItemIdentifier, ChartSeriesType } from '../models/seriesType/config';
import { useCharts } from '../internals/useCharts';
import { ChartsStore } from '../internals/plugins/utils/ChartsStore';

export interface InteractionProviderProps {
  children: React.ReactNode;
}

export type ItemInteractionData<T extends ChartSeriesType> = ChartItemIdentifier<T>;

export const ChartsContext = React.createContext<{ store: ChartsStore } | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ChartsContext.displayName = 'ChartsContext';
}

function InteractionProvider(props: InteractionProviderProps) {
  const { children } = props;

  const { contextValue } = useCharts();
  return <ChartsContext.Provider value={contextValue}>{children}</ChartsContext.Provider>;
}

export { InteractionProvider };
