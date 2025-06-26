'use client';
import * as React from 'react';
import { useGridChartsIntegrationContext } from '../hooks/utils/useGridChartIntegration';
import { ChartState } from '../models/gridChartsIntegration';
import { EMPTY_CHART_INTEGRATION_CONTEXT_STATE } from '../hooks/features/chartsIntegration/useGridChartsIntegration';

export type GridChartsRendererProxyRendererCallback = (
  type: string,
  props: Record<string, any>,
  Component: React.ComponentType<any>,
) => React.ReactNode;

type GridChartsRendererProxyRenderer = React.ComponentType<{
  categories: ChartState['categories'];
  series: ChartState['series'];
  chartType: ChartState['type'];
  configuration: ChartState['configuration'];
  onRender?: GridChartsRendererProxyRendererCallback;
}>;

export interface GridChartsRendererProxyProps {
  id: string;
  label?: string;
  renderer: GridChartsRendererProxyRenderer;
  onRender?: GridChartsRendererProxyRendererCallback;
}

export function GridChartsRendererProxy({
  renderer: Renderer,
  id,
  label,
  onRender,
}: GridChartsRendererProxyProps) {
  const { chartStateLookup, setChartState } = useGridChartsIntegrationContext();

  React.useEffect(() => {
    if (!chartStateLookup[id]) {
      // With this, the proxy "registers" the chart to the context
      setChartState(id, {
        ...EMPTY_CHART_INTEGRATION_CONTEXT_STATE,
        label,
      });
    }
  }, [id, label, setChartState, chartStateLookup]);

  if (!chartStateLookup[id]) {
    return null;
  }

  const { categories, series, type, configuration } = chartStateLookup[id];

  return (
    <Renderer
      categories={categories}
      series={series}
      chartType={type}
      configuration={configuration}
      onRender={onRender}
    />
  );
}
