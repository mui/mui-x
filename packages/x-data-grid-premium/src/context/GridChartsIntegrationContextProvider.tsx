'use client';
import * as React from 'react';
import { GridChartsIntegrationContext } from '../components/chartsIntegration/GridChartsIntegrationContext';
import type {
  ChartState,
  GridChartsIntegrationContextValue,
} from '../models/gridChartsIntegration';
import { EMPTY_CHART_INTEGRATION_CONTEXT_STATE } from '../hooks/features/chartsIntegration/useGridChartsIntegration';

export interface GridChartsIntegrationContextProviderProps {
  children: React.ReactNode;
}

export function GridChartsIntegrationContextProvider({
  children,
}: GridChartsIntegrationContextProviderProps) {
  const [chartStateLookup, setChartStateLookup] = React.useState<Record<string, ChartState>>({});
  const setChartState = React.useCallback((id: string, state: Partial<ChartState>) => {
    if (id === '') {
      return;
    }

    setChartStateLookup((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || EMPTY_CHART_INTEGRATION_CONTEXT_STATE),
        ...state,
      },
    }));
  }, []);

  const value = React.useMemo<GridChartsIntegrationContextValue>(
    () => ({
      chartStateLookup,
      setChartState,
    }),
    [chartStateLookup, setChartState],
  );

  return (
    <GridChartsIntegrationContext.Provider value={value}>
      {children}
    </GridChartsIntegrationContext.Provider>
  );
}
