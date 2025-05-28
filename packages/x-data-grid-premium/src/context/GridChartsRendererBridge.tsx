import * as React from 'react';
import { useGridChartsIntegrationContext } from '../hooks/utils/useGridChartIntegration';

export interface GridChartsRendererBridgeProps {
  renderer: React.ComponentType<{
    categories: string[];
    series: Array<{ id: string; label: string; data: (number | null)[] }>;
    chartType: string;
  }>;
}

export function GridChartsRendererBridge({ renderer: Renderer }: GridChartsRendererBridgeProps) {
  const { categories, series, chartType } = useGridChartsIntegrationContext();
  return <Renderer categories={categories} series={series} chartType={chartType} />;
}
