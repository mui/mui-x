import * as React from 'react';
import { useGridChartsIntegrationContext } from '../hooks/utils/useGridChartIntegration';
import { GridChartsIntegrationContextValue } from '../models/gridChartsIntegration';

export interface GridChartsRendererBridgeProps {
  renderer: React.ComponentType<{
    categories: GridChartsIntegrationContextValue['categories'];
    series: GridChartsIntegrationContextValue['series'];
    chartType: GridChartsIntegrationContextValue['chartType'];
  }>;
}

export function GridChartsRendererBridge({ renderer: Renderer }: GridChartsRendererBridgeProps) {
  const { categories, series, chartType } = useGridChartsIntegrationContext();
  return <Renderer categories={categories} series={series} chartType={chartType} />;
}
