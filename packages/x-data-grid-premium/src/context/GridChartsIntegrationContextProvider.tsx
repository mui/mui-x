'use client';
import * as React from 'react';
import { GridChartsIntegrationContext } from '../components/chartsIntegration/GridChartsIntegrationContext';
import { GridChartsIntegrationContextValue } from '../models/gridChartsIntegration';

export interface GridChartsIntegrationContextProviderProps {
  children: React.ReactNode;
}

export function GridChartsIntegrationContextProvider({
  children,
}: GridChartsIntegrationContextProviderProps) {
  const [categories, setCategories] = React.useState<
    GridChartsIntegrationContextValue['categories']
  >([]);
  const [series, setSeries] = React.useState<GridChartsIntegrationContextValue['series']>([]);
  const [chartType, setChartType] = React.useState<string>('');
  const [configuration, setConfiguration] = React.useState<{ [key: string]: any }>({});

  const value = React.useMemo<GridChartsIntegrationContextValue>(
    () => ({
      categories,
      series,
      chartType,
      configuration,
      setCategories,
      setSeries,
      setChartType,
      setConfiguration,
    }),
    [categories, series, chartType, configuration],
  );

  return (
    <GridChartsIntegrationContext.Provider value={value}>
      {children}
    </GridChartsIntegrationContext.Provider>
  );
}
