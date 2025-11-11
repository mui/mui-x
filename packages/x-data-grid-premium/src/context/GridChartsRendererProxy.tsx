'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridChartsIntegrationContext } from '../hooks/utils/useGridChartIntegration';
import { ChartState } from '../models/gridChartsIntegration';
import { EMPTY_CHART_INTEGRATION_CONTEXT_STATE } from '../hooks/features/chartsIntegration/useGridChartsIntegration';

export type GridChartsRendererProxyRendererCallback = (
  type: string,
  props: Record<string, any>,
  Component: React.ComponentType<any>,
) => React.ReactNode;

type GridChartsRendererProxyRenderer = React.ComponentType<{
  dimensions: ChartState['dimensions'];
  values: ChartState['values'];
  chartType: ChartState['type'];
  configuration: ChartState['configuration'];
  onRender?: GridChartsRendererProxyRendererCallback;
}>;

export interface GridChartsRendererProxyProps {
  /**
   * The unique identifier for the chart.
   */
  id: string;
  /**
   * The label for the chart.
   */
  label?: string;
  /**
   * The renderer component that will render the chart.
   */
  renderer: GridChartsRendererProxyRenderer;
  /**
   * Callback function called when the chart is about to be rendered.
   * Use this to check and modify the chart props before it is rendered.
   */
  onRender?: GridChartsRendererProxyRendererCallback;
}

function GridChartsRendererProxy(props: GridChartsRendererProxyProps) {
  const { renderer: Renderer, id, label, onRender } = props;
  const { chartStateLookup, setChartState } = useGridChartsIntegrationContext();

  React.useEffect(() => {
    if (!chartStateLookup[id]) {
      // With this, the proxy "registers" the chart to the context
      setChartState(id, {
        ...EMPTY_CHART_INTEGRATION_CONTEXT_STATE,
        label,
      });
    }

    return () => {
      delete chartStateLookup[id];
    };
  }, [id, label, setChartState, chartStateLookup]);

  if (!chartStateLookup[id]) {
    return null;
  }

  const { dimensions, values, type, configuration } = chartStateLookup[id];

  return (
    <Renderer
      dimensions={dimensions}
      values={values}
      chartType={type}
      configuration={configuration}
      onRender={onRender}
    />
  );
}

GridChartsRendererProxy.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The unique identifier for the chart.
   */
  id: PropTypes.string.isRequired,
  /**
   * The label for the chart.
   */
  label: PropTypes.string,
  /**
   * Callback function called when the chart is about to be rendered.
   * Use this to check and modify the chart props before it is rendered.
   */
  onRender: PropTypes.func,
  /**
   * The renderer component that will render the chart.
   */
  renderer: PropTypes.func.isRequired,
} as any;

export { GridChartsRendererProxy };
