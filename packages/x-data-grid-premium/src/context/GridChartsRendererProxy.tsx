import * as React from 'react';
import { useGridChartsIntegrationContext } from '../hooks/utils/useGridChartIntegration';
import { GridChartsIntegrationContextValue } from '../models/gridChartsIntegration';

type GridChartsRendererProxyRendererCallback = (
  type: string,
  props: Record<string, any>,
  Component: React.ComponentType<any>,
) => React.ReactNode;

type GridChartsRendererProxyRenderer = React.ComponentType<{
  categories: GridChartsIntegrationContextValue['categories'];
  series: GridChartsIntegrationContextValue['series'];
  chartType: GridChartsIntegrationContextValue['chartType'];
  configuration: GridChartsIntegrationContextValue['configuration'];
  onRender?: GridChartsRendererProxyRendererCallback;
}>;

export interface GridChartsRendererProxyProps {
  renderer: GridChartsRendererProxyRenderer;
  onRender?: GridChartsRendererProxyRendererCallback;
}

export function GridChartsRendererProxy({
  renderer: Renderer,
  onRender,
}: GridChartsRendererProxyProps) {
  const { categories, series, chartType, configuration } = useGridChartsIntegrationContext();
  return (
    <Renderer
      categories={categories}
      series={series}
      chartType={chartType}
      configuration={configuration}
      onRender={onRender}
    />
  );
}
