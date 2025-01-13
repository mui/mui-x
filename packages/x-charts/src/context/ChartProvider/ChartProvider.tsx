'use client';
import * as React from 'react';
import { useCharts } from '../../internals/store/useCharts';
import { ChartProviderProps } from './ChartProvider.types';
import { ChartContext } from './ChartContext';
import {
  ChartAnyPluginSignature,
  ConvertSignaturesIntoPlugins,
} from '../../internals/plugins/models';
import { ChartSeriesConfig } from '../../internals/plugins/models/seriesConfig';
import { useChartCartesianAxis } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useChartInteraction } from '../../internals/plugins/featurePlugins/useChartInteraction';
import { plugin as barPlugin } from '../../BarChart/plugin';
import { plugin as scatterPlugin } from '../../ScatterChart/plugin';
import { plugin as linePlugin } from '../../LineChart/plugin';
import { plugin as piePlugin } from '../../PieChart/plugin';
import { ChartSeriesType } from '../../models/seriesType/config';

export const defaultSeriesConfig: ChartSeriesConfig<'bar' | 'scatter' | 'line' | 'pie'> = {
  bar: barPlugin,
  scatter: scatterPlugin,
  line: linePlugin,
  pie: piePlugin,
};

// For consistency with the v7, the cartesian axes are set by default.
// To remove them, you can provide a `plugins` props.
const defaultPlugins = [useChartCartesianAxis, useChartInteraction];

function ChartProvider<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TSeriesType extends ChartSeriesType,
>(props: ChartProviderProps<TSignatures, TSeriesType>) {
  const {
    children,
    plugins = defaultPlugins as unknown as ConvertSignaturesIntoPlugins<TSignatures>,
    pluginParams = {},
    seriesConfig = defaultSeriesConfig as ChartSeriesConfig<TSeriesType>,
  } = props;

  const { contextValue } = useCharts<TSignatures, TSeriesType>(plugins, pluginParams, seriesConfig);

  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
}

export { ChartProvider };
