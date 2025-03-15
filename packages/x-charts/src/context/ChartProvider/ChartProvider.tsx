'use client';
import * as React from 'react';
import { useCharts } from '../../internals/store/useCharts';
import type { ChartProviderProps } from './ChartProvider.types';
import { ChartContext } from './ChartContext';
import {
  ChartAnyPluginSignature,
  ConvertSignaturesIntoPlugins,
} from '../../internals/plugins/models';
import { ChartSeriesConfig } from '../../internals/plugins/models/seriesConfig';
import { useChartCartesianAxis } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useChartInteraction } from '../../internals/plugins/featurePlugins/useChartInteraction';
import { useChartZAxis } from '../../internals/plugins/featurePlugins/useChartZAxis';
import { useChartHighlight } from '../../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight';
import { seriesConfig as barSeriesConfig } from '../../BarChart/seriesConfig';
import { seriesConfig as scatterSeriesConfig } from '../../ScatterChart/seriesConfig';
import { seriesConfig as lineSeriesConfig } from '../../LineChart/seriesConfig';
import { seriesConfig as pieSeriesConfig } from '../../PieChart/seriesConfig';
import { ChartSeriesType } from '../../models/seriesType/config';

export const defaultSeriesConfig: ChartSeriesConfig<'bar' | 'scatter' | 'line' | 'pie'> = {
  bar: barSeriesConfig,
  scatter: scatterSeriesConfig,
  line: lineSeriesConfig,
  pie: pieSeriesConfig,
};

// For consistency with the v7, the cartesian axes are set by default.
// To remove them, you can provide a `plugins` props.
const defaultPlugins = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
];

function ChartProvider<
  TSeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
>(props: ChartProviderProps<TSeriesType, TSignatures>) {
  const {
    children,
    plugins = defaultPlugins as unknown as ConvertSignaturesIntoPlugins<TSignatures>,
    pluginParams = {},
    seriesConfig = defaultSeriesConfig as ChartSeriesConfig<TSeriesType>,
  } = props;

  const { contextValue } = useCharts<TSeriesType, TSignatures>(plugins, pluginParams, seriesConfig);

  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
}

export { ChartProvider };
