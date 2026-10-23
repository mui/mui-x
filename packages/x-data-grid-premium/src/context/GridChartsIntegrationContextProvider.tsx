'use client';
import * as React from 'react';
import { GridChartsIntegrationContext } from '../components/chartsIntegration/GridChartsIntegrationContext';
import type {
  ChartState,
  GridChartsExcelExport,
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

  // Held here rather than in each chart's state: one Grid publishes it, and clears it when it
  // unmounts, so a chart never keeps an entry bound to a Grid that is gone.
  const [exportGridDataAsExcel, setExportGridDataAsExcelState] =
    React.useState<GridChartsExcelExport | null>(null);

  // Wrapped so callers pass the export itself: a bare `useState` setter would read a function
  // argument as an updater.
  const setExportGridDataAsExcel = React.useCallback(
    (nextExport: GridChartsExcelExport | null) => setExportGridDataAsExcelState(() => nextExport),
    [],
  );

  const value = React.useMemo<GridChartsIntegrationContextValue>(
    () => ({
      chartStateLookup,
      setChartState,
      exportGridDataAsExcel,
      setExportGridDataAsExcel,
    }),
    [chartStateLookup, setChartState, exportGridDataAsExcel, setExportGridDataAsExcel],
  );

  return (
    <GridChartsIntegrationContext.Provider value={value}>
      {children}
    </GridChartsIntegrationContext.Provider>
  );
}
