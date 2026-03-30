'use client';
import * as React from 'react';
import type { ChartsContainerProProps } from '../ChartsContainerPro';
import type { SankeySeriesType } from './sankey.types';
import { SANKEY_CHART_PLUGINS, type SankeyChartPluginSignatures } from './SankeyChart.plugins';
import { ChartsDataProviderPro } from '../ChartsDataProviderPro';
import { sankeySeriesConfig } from './seriesConfig';

const seriesConfig = { sankey: sankeySeriesConfig };

export interface SankeyDataProviderProps extends Omit<
  ChartsContainerProProps<'sankey', SankeyChartPluginSignatures>,
  'plugins' | 'series' | 'slotProps' | 'slots' | 'dataset' | 'hideLegend' | 'skipAnimation'
> {
  children?: React.ReactNode;
  series: readonly SankeySeriesType[];
}

/**
 * Orchestrates the data providers for the sankey chart components and hooks.
 *
 * Use this component if you have custom HTML components that need to access the chart data.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 */
function SankeyDataProvider(props: SankeyDataProviderProps) {
  return (
    <ChartsDataProviderPro<'sankey', SankeyChartPluginSignatures>
      {...props}
      seriesConfig={seriesConfig}
      plugins={SANKEY_CHART_PLUGINS}
    />
  );
}

export { SankeyDataProvider };
