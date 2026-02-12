'use client';
import * as React from 'react';
import { useCharts } from '../../internals/store/useCharts';
import type { ChartsProviderProps } from './ChartsProvider.types';
import { ChartsContext } from './ChartsContext';
import {
  type ChartAnyPluginSignature,
  type ConvertSignaturesIntoPlugins,
} from '../../internals/plugins/models';
import type { ChartSeriesType } from '../../models/seriesType/config';
import { useChartCartesianAxis } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useChartTooltip } from '../../internals/plugins/featurePlugins/useChartTooltip';
import { useChartInteraction } from '../../internals/plugins/featurePlugins/useChartInteraction';
import { useChartZAxis } from '../../internals/plugins/featurePlugins/useChartZAxis';
import { useChartHighlight } from '../../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight';
import type { ChartCorePluginSignatures } from '../../internals/plugins/corePlugins';

// For consistency with the v7, the cartesian axes are set by default.
// To remove them, you can provide a `plugins` props.
const defaultPlugins = [
  useChartZAxis,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
];

function ChartsProvider<
  TSeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = ChartCorePluginSignatures<TSeriesType>,
>(props: React.PropsWithChildren<ChartsProviderProps<TSeriesType, TSignatures>>) {
  const {
    children,
    plugins = defaultPlugins as ConvertSignaturesIntoPlugins<TSignatures>,
    pluginParams = {},
  } = props;

  const { contextValue } = useCharts<TSignatures>(plugins, pluginParams);

  return <ChartsContext.Provider value={contextValue}>{children}</ChartsContext.Provider>;
}

export { ChartsProvider };
