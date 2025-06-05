import * as React from 'react';
import { useGridChartsIntegrationContext } from '../hooks/utils/useGridChartIntegration';
import { GridChartsIntegrationContextValue } from '../models/gridChartsIntegration';

export interface GridChartsRendererProxyProps {
  renderer: React.ComponentType<{
    categories: GridChartsIntegrationContextValue['categories'];
    series: GridChartsIntegrationContextValue['series'];
    chartType: GridChartsIntegrationContextValue['chartType'];
    configuration: GridChartsIntegrationContextValue['configuration'];
  }>;
}

export function GridChartsRendererProxy({ renderer: Renderer }: GridChartsRendererProxyProps) {
  const { categories, series, chartType, configuration } = useGridChartsIntegrationContext();
  return (
    <Renderer
      categories={categories}
      series={series}
      chartType={chartType}
      configuration={configuration}
    />
  );
}
