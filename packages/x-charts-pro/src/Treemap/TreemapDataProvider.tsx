'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { ChartsContainerProProps } from '../ChartsContainerPro';
import type { TreemapSeriesType } from './treemap.types';
import { TREEMAP_CHART_PLUGINS } from './Treemap.plugins';
import type { TreemapChartPluginSignatures } from './Treemap.plugins';
import { ChartsDataProviderPro } from '../ChartsDataProviderPro';
import { treemapSeriesConfig } from './seriesConfig';

const seriesConfig = { treemap: treemapSeriesConfig };

export interface TreemapDataProviderProps extends Omit<
  ChartsContainerProProps<'treemap', TreemapChartPluginSignatures>,
  'plugins' | 'series' | 'slotProps' | 'slots' | 'dataset' | 'hideLegend' | 'skipAnimation'
> {
  children?: React.ReactNode;
  series: readonly TreemapSeriesType[];
}

/**
 * Orchestrates the data providers for the treemap chart components and hooks.
 *
 * Use this component if you have custom HTML components that need to access the chart data.
 *
 * Demos:
 *
 * - [Composition](https://mui.com/x/api/charts/composition/)
 */
function TreemapDataProvider(props: TreemapDataProviderProps) {
  return (
    <ChartsDataProviderPro<'treemap', TreemapChartPluginSignatures>
      {...props}
      seriesConfig={seriesConfig}
      plugins={TREEMAP_CHART_PLUGINS}
    />
  );
}

TreemapDataProvider.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { TreemapDataProvider };
