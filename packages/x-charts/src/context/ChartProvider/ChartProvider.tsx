'use client';
import * as React from 'react';
import { useCharts } from '../../internals/store/useCharts';
import { ChartProviderProps } from './ChartProvider.types';
import { ChartContext } from './ChartContext';

function ChartProvider(props: ChartProviderProps) {
  const { children } = props;

  const { contextValue } = useCharts([], {});

  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
}

export { ChartProvider };
