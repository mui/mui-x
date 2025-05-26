import * as React from 'react';
import { useGridChartsIntegrationContext } from '../hooks/utils/useGridChartIntegration';

export interface GridChartsIntegrationRendererBridgeProps {
  renderer: React.ComponentType<{
    categories: string[];
    series: Array<{ id: string; label: string; data: (number | null)[] }>;
    chartType: string;
  }>;
}

export function GridChartsIntegrationRendererBridge({
  renderer: Renderer,
}: GridChartsIntegrationRendererBridgeProps) {
  const { categories, series, chartType } = useGridChartsIntegrationContext();
  return <Renderer categories={categories} series={series} chartType={chartType} />;
}
