'use client';
import * as React from 'react';
import { useCharts } from '../../internals/store/useCharts';
import type { ChartProviderProps } from './ChartProvider.types';
import { ChartContext } from './ChartContext';
import {
  type ChartAnyPluginSignature,
  type ConvertSignaturesIntoPlugins,
} from '../../internals/plugins/models';
import { useChartCartesianAxis } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useChartTooltip } from '../../internals/plugins/featurePlugins/useChartTooltip';
import { useChartInteraction } from '../../internals/plugins/featurePlugins/useChartInteraction';
import { useChartZAxis } from '../../internals/plugins/featurePlugins/useChartZAxis';
import { useChartHighlight } from '../../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight';
import { defaultSeriesConfig } from './defaultSeriesConfig';

// For consistency with the v7, the cartesian axes are set by default.
// To remove them, you can provide a `plugins` props.
const defaultPlugins = [
  useChartZAxis,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
];

function ChartProvider<TSignatures extends readonly ChartAnyPluginSignature[]>(
  props: React.PropsWithChildren<ChartProviderProps<TSignatures>>,
) {
  const {
    children,
    plugins = defaultPlugins as unknown as ConvertSignaturesIntoPlugins<TSignatures>,
    pluginParams = {},
  } = props;

  const { contextValue } = useCharts<TSignatures>(plugins, {
    seriesConfig: defaultSeriesConfig,
    ...pluginParams,
  });

  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
}

export { ChartProvider };
